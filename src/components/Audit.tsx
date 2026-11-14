import { products } from '../data';
import { creditFor, ProductImage } from './ProductImage';

/** #/audit — contact sheet of every product photo, for checking image quality. */
export function Audit() {
  const missing = products.filter((p) => !creditFor(p.id));
  return (
    <section>
      <div className="hero">
        <div className="hero-text">
          <span className="eyebrow">Photo audit</span>
          <h1>{products.length} products</h1>
          <p className="muted">{missing.length} without a photo.</p>
        </div>
      </div>
      <div className="audit">
        {products.map((p, i) => (
          <div key={p.id} className={`audit-cell ${creditFor(p.id) ? '' : 'missing'}`}>
            <ProductImage product={p} size="md" />
            <div className="small">
              <b>{i + 1}.</b> {p.id}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
