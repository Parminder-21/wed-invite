import { getWeddingConfig } from '@/lib/config';
import InvitationWrapper from '@/components/public/InvitationWrapper';

// Ensure the page gets rendered on request (to reflect Admin panel updates immediately)
export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const config = await getWeddingConfig();
  return {
    title: config.seo.title,
    description: config.seo.description,
    keywords: config.seo.keywords,
  };
}

export default async function Page() {
  const config = await getWeddingConfig();

  return <InvitationWrapper config={config} />;
}
