import PortfolioGallery from '@/components/PortfolioGallery';
import { listCategories, listPhotos } from '@/lib/queries';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Portfolio' };

const u = (id) => `https://images.unsplash.com/photo-${id}?w=600&q=80`;
const FALLBACK = [
  { id: 1, image: u('1606800052052-a08af7148866'), title: 'Wedding Day', category_name: 'Wedding' },
  { id: 2, image: u('1519741497674-611481863552'), title: 'First Dance', category_name: 'Wedding' },
  { id: 3, image: u('1529636798458-92182e662485'), title: 'Bridal Portrait', category_name: 'Portrait' },
  { id: 4, image: u('1583939003579-730e3918a45a'), title: 'Celebration', category_name: 'Events' },
  { id: 5, image: u('1511285560929-80b456fea0bc'), title: 'Engagement', category_name: 'Engagement' },
  { id: 6, image: u('1558618666-fcd25c85cd64'), title: 'Outdoor Shoot', category_name: 'Portrait' },
  { id: 7, image: u('1537633552985-df8429e8048b'), title: 'Garden Wedding', category_name: 'Wedding' },
  { id: 8, image: u('1620682595039-d8af4dbf5439'), title: 'Birthday', category_name: 'Events' },
  { id: 9, image: u('1524863479829-916d8e77f114'), title: 'Couple', category_name: 'Engagement' },
  { id: 10, image: u('1623855244183-52fd8d3ce2f7'), title: 'Ceremony', category_name: 'Wedding' },
  { id: 11, image: u('1540575467063-178a50c2df87'), title: 'Corporate', category_name: 'Events' },
  { id: 12, image: u('1531058020387-3be344556be6'), title: 'Family', category_name: 'Portrait' },
];

export default async function Portfolio() {
  const [photos, categories] = await Promise.all([listPhotos(), listCategories()]);
  const hasReal = photos.length > 0;

  // With no uploads yet, show the demo set and build its tabs from the demo categories.
  const shown = hasReal ? photos : FALLBACK;
  const tabs = hasReal ? categories.map(c => c.name) : [...new Set(FALLBACK.map(p => p.category_name))];

  return (
    <div style={{ paddingTop: '120px', minHeight: '100vh' }}>
      <div style={{ textAlign: 'center', padding: '60px 48px 80px' }}>
        <p style={{ fontSize: '11px', letterSpacing: '0.35em', color: 'var(--gold)', marginBottom: '20px' }}>THE WORK</p>
        <h1 style={{ fontSize: 'clamp(42px, 7vw, 80px)', fontWeight: 300 }}>Portfolio <em style={{ fontStyle: 'italic' }}>Gallery</em></h1>
        {hasReal && (
          <p style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '16px', letterSpacing: '0.1em' }}>
            {photos.length} {photos.length === 1 ? 'photo' : 'photos'}
          </p>
        )}
      </div>
      <PortfolioGallery photos={shown} tabs={tabs} />
    </div>
  );
}
