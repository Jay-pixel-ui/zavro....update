import { Link } from "react-router-dom";

export default function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-8" data-testid="breadcrumbs">
      <ol className="flex flex-wrap items-center gap-2 font-mono text-xs uppercase tracking-widest text-z-muted">
        {items.map((c, i) => (
          <li key={c.to} className="flex items-center gap-2">
            {i < items.length - 1 ? (
              <>
                <Link to={c.to} className="link-u hover:text-white">{c.label}</Link>
                <span aria-hidden="true" className="text-z-cyan/60">/</span>
              </>
            ) : (
              <span aria-current="page" className="text-z-body">{c.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
