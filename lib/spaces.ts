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
  liveSpaceUrl?: string;
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
    description: 'Compare text-to-product and image-neighbour retrieval across two model spaces.',
    preview: '/spaces/previews/abo-catalog.png',
    viewerUrl: '/spaces/abo-catalog/',
    liveSpaceUrl: 'https://hyper3labs-hyperview-abo-catalog.hf.space',
  },
  {
    slug: 'precision-regions',
    name: 'Precision Regions',
    context: 'Region-level retrieval audit',
    workflow: 'Region retrieval',
    modality: 'Scenes · crops · ranked regions',
    question: "Does the exact region reach the operator's first screen?",
    description: 'Inspect the source scene, target crop, and aligned Top 5 results over the same candidate pool.',
    preview: '/spaces/previews/precision-regions.png',
    viewerUrl: '/spaces/precision-regions/',
  },
  {
    slug: 'fashion-products',
    name: 'Fashion Products',
    context: 'Fashion product matching',
    workflow: 'Catalog search',
    modality: 'Product photos · text · ranked matches',
    question: 'Can the catalog recognize the same product from a different photo?',
    description: 'Compare same-product photo matching and typed shopper searches across two models.',
    preview: '/spaces/previews/fashion-products.png',
    viewerUrl: '/spaces/fashion-products/',
    liveSpaceUrl: 'https://hyper3labs-hyperview-deepfashion-text-search.hf.space',
  },
  {
    slug: 'logo-search',
    name: 'Logo Search',
    context: 'Creative asset retrieval',
    workflow: 'Catalog search',
    modality: 'Logos · creative briefs · style map',
    question: 'Which existing logo best satisfies a detailed creative brief?',
    description: 'Compare creative-brief results, exact-asset ranks, and archive coverage without relying on folders or tags.',
    preview: '/spaces/previews/logo-search.png',
    viewerUrl: '/spaces/logo-search/',
    liveSpaceUrl: 'https://mnm-matin-hyperview-logo-brand-search.hf.space',
  },
  {
    slug: 'geospatial',
    name: 'GeoSpatial',
    context: 'Remote-sensing archive QA',
    workflow: 'Archive QA',
    modality: 'Aerial imagery · neighbours · topology',
    question: 'Which aerial tiles belong together?',
    description: 'Compare same-class and land-use-group neighbours, then inspect the full archive maps.',
    preview: '/spaces/previews/geospatial.png',
    viewerUrl: '/spaces/geospatial/',
    liveSpaceUrl: 'https://mnm-matin-hyperview-eurosat-geospatial.hf.space',
  },
  {
    slug: 'visual-safety',
    name: 'Visual Safety',
    context: 'Model audit · review ops',
    workflow: 'Trust & safety',
    modality: 'Images · review batches · ranking quality',
    question: 'What does each model’s review queue miss?',
    description:
      'Audit the review batches both models build around a confirmed item, with the full missed-item and precision/recall ledger.',
    preview: '/spaces/previews/visual-safety.png',
    viewerUrl: '/spaces/visual-safety/',
    liveSpaceUrl: 'https://mnm-matin-hyperview-visual-safety.hf.space',
  },
];
