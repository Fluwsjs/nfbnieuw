# Service Images for NFB Salon

This directory contains images used for the various services offered by NFB Salon. The following image files are required for proper functioning of the website:

## Required Images

1. `facial.jpg` - Used for facial treatments (Gezichtsbehandelingen)
2. `lashes.jpg` - Used for waxing and eyebrow treatments (Waxen, Epileren & Verven)
3. `nails.jpg` - Used for nail treatments (Nagelbehandelingen)

## Image Guidelines

- Recommended size: 800x600 pixels (landscape orientation)
- Format: JPG or WebP
- File size: Keep under 300KB for optimal performance
- Content: High-quality professional images that represent each service
- Style: Consistent with the salon's aesthetic (warm tones, elegant styling)

## Usage Example

The services page references these images in the following way:

```typescript
const services = [
  {
    id: "gezichtsbehandelingen",
    name: "Gezichtsbehandelingen",
    description: "Professionele en persoonlijke gezichtsbehandelingen voor een stralende huid.",
    image: "/images/services/facial.jpg",
    // ...
  },
  // ...other services
];
```

## Note

Empty placeholder files have been created for development purposes. Replace these with actual service images for production use. 