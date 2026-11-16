import { NameHeader, type NameFont } from "@/components/NameHeader";
import { PhotoSlideshow } from "@/components/PhotoSlideshow";
import { Row } from "@/components/Row";
import { content, nameFontsHref, photos, SITE_FONTS } from "@/lib/content";
import { Inline } from "@/lib/inline";

const { site, labels, name_fonts } = content;

const fonts: NameFont[] = name_fonts.fonts.map((f) => {
  const own = SITE_FONTS[f.font];
  const quoted = `"${f.font.trim()}"`;
  return {
    family: own ?? `${quoted}, var(--serif)`,
    load: own ?? quoted,
    weight: f.weight,
    italic: f.italic,
    tracking: f.tracking,
  };
});

export default function AboutPage() {
  const hasPhotos = photos.length > 0;
  return (
    <div className="about-wrap">
      <div className={hasPhotos ? "about" : "about no-photos"}>
        <header className="hero-head">
          <NameHeader
            name={site.name}
            fonts={fonts}
            href={nameFontsHref()}
            size={name_fonts.size}
            enabled={name_fonts.enabled}
            holdMs={Math.round(name_fonts.hold_seconds * 1000)}
            typeMs={name_fonts.type_ms}
            deleteMs={name_fonts.delete_ms}
            cursor={name_fonts.cursor}
          />
          <p className="subtitle">
            <Inline text={site.subtitle} />
          </p>
        </header>

        <ul className="intro">
          {content.intro.map((line, i) => (
            <li key={i}>
              <Inline text={line} />
            </li>
          ))}
          <li>
            {labels.email_prefix} <a href={`mailto:${content.email}`}>{content.email}</a>.
            {content.email_note ? (
              <>
                {" "}
                <Inline text={content.email_note} />
              </>
            ) : null}
          </li>
        </ul>

        {hasPhotos && (
          <PhotoSlideshow
            photos={photos}
            labels={{
              photos: labels.photos,
              previous: labels.previous_photo,
              next: labels.next_photo,
              position: labels.photo_position,
            }}
          />
        )}

        {content.education.length > 0 && (
          <section className="about-more" aria-labelledby="education-heading">
            <h2 className="label" id="education-heading">
              {labels.education_heading}
            </h2>
            <ul className="rows">
              {content.education.map((ed, i) => (
                <Row key={i} when={ed.dates}>
                  <h3 className="row-title">
                    {ed.title} · {ed.school}
                  </h3>
                  {ed.summary && (
                    <p className="row-desc">
                      <Inline text={ed.summary} />
                    </p>
                  )}
                </Row>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
