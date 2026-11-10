// Build stages, in build order. Edit freely.
// status: "not-started" | "in-progress" | "done"
// Each post's front matter `stage:` must match one of these slugs.
export default [
  { slug: "before-the-build", name: "Before the build", status: "in-progress",
    description: "Planning, ordering, kit delivery and checking every box." },
  { slug: "front-end", name: "Front End", status: "not-started",
    description: "Front suspension, steering and brakes." },
  { slug: "engine-gearbox", name: "Engine & Gearbox", status: "not-started",
    description: "Fitting the engine and gearbox." },
  { slug: "drive-exhaust", name: "Drive and Exhaust", status: "not-started",
    description: "Propshaft, driveline and exhaust system." },
  { slug: "electrics", name: "Electrics", status: "not-started",
    description: "Wiring loom, dashboard, lights and switches." },
  { slug: "rear-end", name: "Rear End", status: "not-started",
    description: "Rear suspension, axle, brakes and lights." },
  { slug: "interior", name: "Interior", status: "not-started",
    description: "Seats, harnesses, carpets and steering wheel." },
  { slug: "exterior", name: "Exterior", status: "not-started",
    description: "Nosecone, wings, bonnet and trim." },
  { slug: "weather-protection", name: "Weather protection", status: "not-started",
    description: "Hood, side screens and tonneau." },
  { slug: "other-stuff", name: "Other stuff", status: "not-started",
    description: "Everything that doesn't fit anywhere else." },
];
