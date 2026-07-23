export type SpaceWorkflow =
  | 'Catalog search'
  | 'Region retrieval'
  | 'Archive QA'
  | 'Trust & safety';

export type HyperViewSpace = {
  slug: string;
  name: string;
  context: string;
  workflow: SpaceWorkflow;
  modality: string;
  question: string;
  description: string;
  preview: string;
  viewerUrl: string;
};

export const SPACE_WORKFLOWS: Array<'All' | SpaceWorkflow> = [
  'All',
  'Catalog search',
  'Region retrieval',
  'Archive QA',
  'Trust & safety',
];

export const HYPERVIEW_SPACES: HyperViewSpace[] = [
  {
    slug: 'abo-catalog',
    name: 'ABO Catalog',
    context: 'Product retrieval workbench',
    workflow: 'Catalog search',
    modality: 'Images · embeddings · ranked neighbours',
    question: 'Does the model find the right product—not just a plausible category match?',
    description: 'Compare prepared text and image retrieval cases across two model spaces, with linked results and catalog topology.',
    preview: '/spaces/previews/abo-catalog.png',
    viewerUrl: process.env.NEXT_PUBLIC_SPACE_ABO_URL ?? 'http://127.0.0.1:18118/?v=5',
  },
  {
    slug: 'precision-regions',
    name: 'Precision Regions',
    context: 'Region-level retrieval audit',
    workflow: 'Region retrieval',
    modality: 'Scenes · crops · prepared rankings',
    question: "Does the exact region reach the operator's first screen?",
    description: 'Inspect the source scene, boxed ground truth, and aligned Top 5 results over the same candidate pool.',
    preview: '/spaces/previews/precision-regions.png',
    viewerUrl: process.env.NEXT_PUBLIC_SPACE_PRECISION_URL ?? 'http://127.0.0.1:18119/?v=10',
  },
  {
    slug: 'fashion-products',
    name: 'Fashion Products',
    context: 'Typed product search audit',
    workflow: 'Catalog search',
    modality: 'Fashion images · text · catalog map',
    question: "Does the exact SKU reach the shopper's first screen?",
    description: 'Audit whether decisive product attributes survive multimodal retrieval, then inspect the result in catalog context.',
    preview: '/spaces/previews/fashion-products.png',
    viewerUrl: process.env.NEXT_PUBLIC_SPACE_FASHION_URL ?? 'http://127.0.0.1:18120/',
  },
  {
    slug: 'logo-search',
    name: 'Logo Search',
    context: 'Creative asset retrieval',
    workflow: 'Catalog search',
    modality: 'Logos · creative briefs · style map',
    question: 'Which existing logo best satisfies a detailed creative brief?',
    description: 'Compare prepared brief results, exact-asset ranks, and archive coverage without relying on manual folders or tags.',
    preview: '/spaces/previews/logo-search.png',
    viewerUrl: process.env.NEXT_PUBLIC_SPACE_LOGO_URL ?? 'http://127.0.0.1:18122/',
  },
  {
    slug: 'geospatial',
    name: 'GeoSpatial',
    context: 'Remote-sensing archive QA',
    workflow: 'Archive QA',
    modality: 'Aerial imagery · neighbours · topology',
    question: 'Do retrieved neighbours preserve land-use identity and avoid costly confusion?',
    description: 'Inspect exact and parent-class consistency while comparing how two model maps organize the same aerial archive.',
    preview: '/spaces/previews/geospatial.png',
    viewerUrl: process.env.NEXT_PUBLIC_SPACE_GEO_URL ?? 'http://127.0.0.1:18123/',
  },
  {
    slug: 'visual-safety',
    name: 'Visual Safety',
    context: 'Review-queue operating-point audit',
    workflow: 'Trust & safety',
    modality: 'Images · proxy labels · review queues',
    question: 'Is one extra catch worth five false reviews and six more queue slots?',
    description: 'Compare a fixed review rule across two models and inspect the concrete gains, misses, and operating costs.',
    preview: '/spaces/previews/visual-safety.png',
    viewerUrl: process.env.NEXT_PUBLIC_SPACE_SAFETY_URL ?? 'http://127.0.0.1:18124/',
  },
];
