# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Vue 3 + Vite + Tailwind CSS + DaisyUI (DaisyUI noted as uncertain). Scene content lives in the repo as JSON or Markdown. Images stay on local disk for now; object storage comes later.

## Users

Primary: a writer assembling a history piece who already generates AI images as scene storyboards. They sit down to read the script against those images, scene by scene, the way they would page through a comic.

Secondary: a trusted friend who may be handed the same local reader to experience the piece. Not a public audience, not a multiplayer product.

## Product Purpose

Meddah is a local comic-style reader for a script paired with images. Each scene shows the picture beside the text. Success is finishing a pass through the history piece without breaking concentration to hunt files, match filenames, or switch apps.

## Positioning

The app performs the piece: it is the meddah, not a storyboard manager, not an image generator, and not a writing studio. Pairing is done in content files. The product is the telling.

## Operating Context

The writer already has a history script and a folder of generated scene images. They will keep scene text in git (JSON or Markdown) and point the reader at a local image folder. There is no account, no share sheet, no marketing site in this version.

## Capabilities and Constraints

- V1 is a reader only. No in-app pairing, cropping, or generation UI.
- One open piece at a time, browsed scene by scene, image beside text.
- UI copy in Turkish by default, English available. Story text is whatever the content files contain.
- Images are local files referenced by the content. They are not committed as the long-term source of truth; a bucket comes later.
- Undecided: exact content schema (JSON vs Markdown vs both), keyboard map, and whether a scene may hold more than one image.

## Brand Commitments

Name is **Meddah**, after the Ottoman storyteller who performs a tale for a room. Sibling names in the maker's line: çetele, vird, notos, carar. Turkish wordplay and short Latin/Greek-feel names are the register; English SaaS descriptiveness is not. Temaşa was a strong alternate (the watching) and was set aside because Tamasha is already a large streaming brand, and because the product is the teller.

## Evidence on Hand

The writer has an unpublished history script and AI-generated scene images. Paths are not in this repo yet. Do not invent that the piece is published, awarded, or historically authoritative. Any demonstration story that is not theirs must be labeled synthetic.

## Product Principles

- The telling is the product. Chrome, libraries, and file management stay out of the way of the next scene.
- Content files in git are the source of truth for text; the UI does not become a CMS.
- Local-first until a bucket is actually needed.
- Named and crafted enough to feel finished; not a company, not a landing page, not a half-launched platform.
- Turkish is the home voice of the interface.
