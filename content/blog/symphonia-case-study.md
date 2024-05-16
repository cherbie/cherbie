---
draft: false
external: false
title: Symphonia Play Case Study
description: How to go about processing audio as told by the Symphonia Play project
date: 2024-05-16
---

## Abstract

*[Symphonia Play](https://github.com/pdeljanov/Symphonia/blob/master/symphonia-play/README.md)*, part of the Rust *[Symphonia](https://github.com/pdeljanov/Symphonia)* project, is a simple audio player used to test audio sample processing. It can be utilized to better comprehend the patterns and data structures that might aid in interfacing with audio samples not directly supported by *[Rodio](https://github.com/RustAudio/rodio)*. This will help us understand how to design a library that can interact with *Rodio* to output audio.

## Requirements

Currently, we aim to process audio samples using a variety of `codec(s)` defined through an `m3u8` playlist file. I have chosen the `Rodio` rust crate to support cross-platform audio output.

We will likely need to use `Symphonia` to process some of the audio samples provided by the HLS server. This is necessary because `Rodio` only supports MP3 files and a few other formats. This support is insufficient when used with an `m3u8` playlist, as a wider range of `codec(s)` need to be supported. An audio processing library like `Symphonia` is already configured to handle this processing; we don’t need to reinvent that wheel.

## Symphonia

### Demuxing vs Decoding

The process of reading a media file and gradually extracting the tracks from the audio sample is known as *”demultiplexing”* or *”demuxing”*. The opposite process, which involves converting the track *”packet”* back into the codec sample data, is referred to as *”decoding”*.

*Symphonia* distinguishes between these two processes. Upon analysis, you'll see that they operate in conjunction (refer to the *decode loop*). One process extracts metadata, such as the codec type or *artist information*. The other process decodes the packet information back into a byte sequence, which output devices can interpret.

### MediaSource

*Symphonia* uses the concept of a `MediaSource` which is a seek-able, readable stream that can be used to create a `MediaSourceStream` instance. From this `MediaSourceStream` we can use the default `probe` provided by *Symphonia* to detect the underline format of the `MediaSource` providing a reader or more specifically a `trait FormatReader` over this source.

### FormatReader

The `FormatReader` trait in *Symphonia* is a key component in handling and decoding media formats. It is responsible for managing multiple tracks that may make up a `MediaSource`. Each track has a codec associated with it, which is a means of encoding and decoding a digital data stream or signal.

Each track in the `FormatReader` is also rich in metadata, a set of data that gives information about other data. The metadata fields can include a wide array of information about the media, such as its *duration*, *bitrate*, *sample rate*, and more, depending on the specifics of the codec and format in use.

The `FormatReader` trait in *Symphonia* provides a way to access and process the individual tracks of a media file, each with its own codec and rich metadata, and derive decoders for handling the digital data streams provided by the media file. This recursive logic is termed the *”decode loop”*.

### Decode Loop

The decode loop is where all the magic happens and where we are able to process the information described by the `FormatReader`.

The `FormatReader` uses the codec associated with each track to derive a decoder, a component that converts the encoded data back into a format that can be understood and processed by an underlying output device. This process involves parsing the encoded data, often involving complex computational algorithms to accurately reproduce the original data from the encoded form.

Pseudo-code for the audio processing decode loop may look something like this

```
// Pseudocode for audio processing decode loop
while there are packets in the media format:
    Acquire a packet from the media format
    Consume any new metadata
    Filter the packet
    if packet is not for the selected track:
        Continue to next packet
    Decode the packet into audio samples using its associated decoder
    Write the decoded samples to the audio output device
end while
```

### Processing AudioBuffer

In *Symphonia,* an `AudioBuffer` is a data structure that contains the underlying byte sequence and a `SignalSpec` for an audio device to make sense of the underlying byte sequence.

Getting to the point of processing the buffer in the decode loop you have two options. You can either manually process samples within the `AudioBufferRef` provided by the `AudioBuffer` struct like so:

```rust
use symphonia_core::audio::{AudioBufferRef, Signal};

let decoded = decoder.decode(&packet).unwrap();

match decoded {
    AudioBufferRef::F32(buf) => {
        for &sample in buf.chan(0) {
            // Do something with `sample`.
        }
    }
    _ => {
        // Repeat for the different sample formats.
        unimplemented!()
    }
}
```

Otherwise, there is a structure called a `SampleBuffer` whose responsibility it is to allocate a block of memory in which `AudioBuffer(s)` can be placed within. Methods provided in the structures' interface allow you to manipulate the allocated memory in a structured manner.

In the example below, the `copy_interleaved_ref()` method is used to write the newly decoded information (the `AudioBuffer`) into the `SampleBuffer`.

```rust
use symphonia_core::audio::SampleBuffer;

// Create a sample buffer that matches the parameters of the decoded audio buffer.
let mut sample_buf = SampleBuffer::<f32>::new(decoded.capacity() as u64, *decoded.spec());

// Copy the contents of the decoded audio buffer into the sample buffer whilst performing
// any required conversions.
sample_buf.copy_interleaved_ref(decoded);

// The interleaved f32 samples can be accessed as follows.
let samples = sample_buf.samples();
```

## Symphonia Play

Now, let's consider the symphonia play binary. There are many trivial aspects, such as defining the command-line arguments, that we aren't particularly concerned about. Key elements that we are concerned about include the definition of an `AudioOutput` trait, which defines a `write()` method and a `flush()` method. The write method is responsible for taking an `AudioBuffer` and writing it to the output device.

Looking at the `cpal` module specifically we noticed a trait is defined for `AudioOutputSample` that is implemented for the `f32`, `i16` and `u16` data types to extend the cross-platform support `cpal` already provides using these core data types.

Inspecting the `CpalAudioOutputImpl` struct which is a concrete structure that implements the `AudioOutput` trait. 

```rust
struct CpalAudioOutputImpl<T: AudioOutputSample> {
    ring_buf_producer: rb::Producer<T>,
    sample_buf: SampleBuffer<T>,
    stream: cpal::Stream,
    resampler: Option<Resampler<T>>,
}
```

The two elements within the structure we will focus on are the sample buffer and the ring buffer. The `cpal::Stream` is used to represent the audio output to the device which is out of scope in this case study.

### The Ring Buffer

The ring buffer's usage is noteworthy as it offers a FIFO interface to maintain the order of audio samples while consuming them efficiently from both ends of the stream. Within the `CpalAudioOutputImpl` constructor, a closure is defined. In this closure, the `rb::Consumer` end of the ring buffer performs a blocking read for audio sample data and writes it to the device output, `cpal::Stream`.

Let's turn our attention to the `write()` method. This is where we modify the other end of the ring buffer. Initially, we modify the data containing the samples using the provided method, `copy_interleaved_ref()`, as illustrated in this example:

```rust
// overwrite the sample buffer with the decoded AudioBufferRef
self.sample_buf.copy_interleaved_ref(decoded);
let samples = self.sample_buf.samples();
```

Once the underlying data within the buffer is written, we write to the ring buffer in a blocking fashion.

```rust
// Write all samples to the ring buffer.
while let Some(written) = self.ring_buf_producer.write_blocking(samples) {
    samples = &samples[written..];
}
```

It seems like the allocated size of the ring buffer is the main mechanism that defines the audio/video buffering size. Back pressure will be placed on the blocking writing calls based on the speed at which the data from the ring buffer can be consumed.

### Runtime

In the [main.rs](https://github.com/pdeljanov/Symphonia/blob/master/symphonia-play/src/main.rs) Rust file, two functions are defined: `play()` and `play_track()`. While these two functions have similar signatures, their purposes differ slightly.

The `play_track()` function reads from the `FormatReader`, selects a track with a suitable `codec`, and decodes the track's packets within a decode loop.

```rust
// Abbreviated decode loop
// Decode all packets, ignoring all decode errors.
let result = loop {
    let packet = match reader.next_packet() {
        Ok(packet) => packet,
        Err(err) => break Err(err),
    };

    // If the packet does not belong to the selected track, skip over it.
    if packet.track_id() != track_id {
        continue;
    }

    // Decode the packet into audio samples.
    match decoder.decode(&packet) {
        Ok(_decoded) => continue,
        Err(Error::DecodeError(err)) => warn!("decode error: {}", err),
        Err(err) => break Err(err),
    }
};
```

The decode loop is expected to terminate with an error. The _"happy path"_ expects an `io::Error` of a `std::io::ErrorKind::UnexpectedEof` kind, which signals the end of file (`EOF`) in the `MediaSource`. This is a special error case that is handled by disregarding it.

## Conclusion

Examining the *Symphonia Play* binary has given us a deeper understanding of how to build an audio player for our specific needs. Key insights include the functionality of the *Symphonia* `FormatReader`, responsible for demuxing and decoding audio media formats, as well as investigating the structure and functions of the decode loop in processing information provided by the `FormatReader`.