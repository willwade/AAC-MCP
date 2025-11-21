export type AacProcessor = {
    model: string;
    manufacturer: string;
    maxChannels: number;
    maxBitrateKbps: number;
    optimizedFor: string;
};

export const AAC_PROCESSORS: AacProcessor[] = [
    {
        model: "Helix-X2",
        manufacturer: "Acousto Labs",
        maxChannels: 8,
        maxBitrateKbps: 512,
        optimizedFor: "Low-latency streaming and conversational agents",
    },
    {
        model: "Cortex-Audio 940",
        manufacturer: "SignalForge",
        maxChannels: 6,
        maxBitrateKbps: 384,
        optimizedFor: "On-device AAC rendering in constrained environments",
    },
    {
        model: "PulseWave M3",
        manufacturer: "Northwind DSP",
        maxChannels: 10,
        maxBitrateKbps: 640,
        optimizedFor: "High-fidelity multi-room playback",
    },
    {
        model: "VectorTone S1",
        manufacturer: "Aurora Micro",
        maxChannels: 4,
        maxBitrateKbps: 256,
        optimizedFor: "Battery-sensitive AAC processing for wearables",
    },
];
