import React, { useEffect, useState } from 'react';
import EditableImage from './EditableImage';
import './AdminHomepageImages.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
const portalClass = value => String(value || '').split(/\s+/).filter(Boolean).flatMap(name => ({
  "ops-main": ["tadm-operations-ops-main"],
  "ops-heading": ["tadm-operations-ops-heading"],
  "ops-panel": ["tadm-operations-ops-panel"],
  "ops-actions": ["tadm-operations-ops-actions"],
  "ops-row-actions": ["tadm-operations-ops-row-actions"],
  "ops-primary": ["tadm-operations-ops-primary"],
  "ops-metrics": ["tadm-operations-ops-metrics"],
  "ops-quick": ["tadm-operations-ops-quick"],
  "ops-table-wrap": ["tadm-operations-ops-table-wrap"],
  "ops-badge": ["tadm-operations-ops-badge"],
  "ops-toolbar": ["tadm-operations-ops-toolbar"],
  "ops-dates": ["tadm-operations-ops-dates"],
  "ops-pagination": ["tadm-operations-ops-pagination"],
  "ops-alert": ["tadm-operations-ops-alert"],
  "ops-success": ["tadm-operations-ops-success"],
  "ops-empty": ["tadm-operations-ops-empty"],
  "ops-overlay": ["tadm-operations-ops-overlay"],
  "ops-modal": ["tadm-operations-ops-modal"],
  "ops-form": ["tadm-operations-ops-form"],
  "ops-form-grid": ["tadm-operations-ops-form-grid"],
  "ops-nav": ["tadm-operations-ops-nav"],
  "ops-nav-top": ["tadm-operations-ops-nav-top"],
  "ops-brand": ["tadm-operations-ops-brand"],
  "ops-nav-controls": ["tadm-operations-ops-nav-controls"],
  "ops-nav-links": ["tadm-operations-ops-nav-links"],
  "ops-mobile-toggle": ["tadm-operations-ops-mobile-toggle"],
  "ops-pos-grid": ["tadm-operations-ops-pos-grid"],
  "ops-pos-total": ["tadm-operations-ops-pos-total"],
  "ops-pos-qty": ["tadm-operations-ops-pos-qty"],
  "ops-danger": ["tadm-operations-ops-danger"],
  "ops-password": ["tadm-operations-ops-password"],
  "admin-homepage-wrapper": ["tadm-adminhomepageimages-admin-homepage-wrapper"],
  "home1-page-new-home": ["tadm-adminhomepageimages-home1-page-new-home"],
  "admin-section": ["tadm-adminhomepageimages-admin-section"],
  "admin-section-title": ["tadm-adminhomepageimages-admin-section-title"],
  "admin-grid-3": ["tadm-adminhomepageimages-admin-grid-3"],
  "admin-grid-4": ["tadm-adminhomepageimages-admin-grid-4"],
  "admin-grid-5": ["tadm-adminhomepageimages-admin-grid-5"],
  "admin-grid-6": ["tadm-adminhomepageimages-admin-grid-6"],
  "admin-card-standard": ["tadm-adminhomepageimages-admin-card-standard"],
  "admin-card-square": ["tadm-adminhomepageimages-admin-card-square"],
  "admin-card-circle": ["tadm-adminhomepageimages-admin-card-circle"],
  "home1-hero-frame-new-home": ["tadm-adminhomepageimages-home1-hero-frame-new-home"],
  "home1-hero-frame-new-home-2": ["tadm-adminhomepageimages-home1-hero-frame-new-home-2"],
  "main-hero-slide": ["tadm-adminhomepageimages-main-hero-slide"],
  "home1-hero-slide-new-home-2": ["tadm-adminhomepageimages-home1-hero-slide-new-home-2"],
  "cool4-tabs": ["tadm-adminhomepageimages-cool4-tabs"],
  "cool4-tab": ["tadm-adminhomepageimages-cool4-tab"],
  "is-active": ["tadm-adminhomepageimages-is-active"]
})[name] || ["tadm-adminhomepageimages-" + name]).join(' ');
const API_BASE = process.env.REACT_APP_API_BASE_URL || 'https://taras-kart-backend.vercel.app';
export default function AdminHomepageImages() {
  const [remoteMap, setRemoteMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [coolTab, setCoolTab] = useState('plazzo');
  useEffect(() => {
    let isMounted = true;
    const run = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/homepage-images`, {
          cache: 'no-store'
        });
        if (!res.ok) {
          if (isMounted) setLoading(false);
          return;
        }
        const data = await res.json();
        const map = {};
        data.forEach(item => {
          map[item.id] = item;
        });
        if (isMounted) {
          setRemoteMap(map);
          setLoading(false);
        }
      } catch (e) {
        if (isMounted) setLoading(false);
      }
    };
    run();
    return () => {
      isMounted = false;
    };
  }, []);
  const getSlot = (path, altText, section) => {
    const rec = remoteMap[path];
    return {
      id: path,
      section: rec?.section || section || 'homepage',
      defaultUrl: path,
      imageUrl: rec?.imageUrl || path,
      altText: rec?.altText || altText
    };
  };
  const handleUpdated = updated => {
    setRemoteMap(prev => ({
      ...prev,
      [updated.id]: updated
    }));
  };
  if (loading) {
    return <>
        
        <div className={portalClass("admin-homepage-wrapper")} style={{
        padding: '40px',
        color: "#42536a"
      }}>
          <h2 className="tadm-adminhomepageimages-node-0">Loading preview...</h2>
        </div>
      </>;
  }
  const mainHeroBanners = ['/images/ATTACH-BANNER.png', '/images/CUCUMBER-BANNER.png', '/images/QUICK-DRY-BANNER.png', '/images/JOCKEY-BANNER.png', '/images/TWIN-BIRDS-BANNER.png', '/images/INDIAN-FLOWER-BANNER.png', '/images/DAZZEL-BANNER.png', '/images/ASWATI-BANNER.png'];
  const womenGrid = ['/images/updated/grid1.jpg', '/images/updated/grid2.jpg', '/images/updated/grid3.jpg', '/images/updated/grid4.jpg'];
  const coolImages = {
    plazzo: ['/images/updated/plazzo1.webp', '/images/updated/plazzo2.webp', '/images/updated/plazzo3.webp', '/images/updated/plazzo4.webp'],
    jeggings: ['/images/updated/jeggings1.webp', '/images/updated/jeggings2.webp', '/images/updated/jeggings3.webp', '/images/updated/jeggings4.webp'],
    nightPants: ['/images/updated/night-pants1.webp', '/images/updated/night-pants4.webp', '/images/updated/night-pants4.webp', '/images/updated/night-pants4.webp'],
    tshirts: ['/images/updated/t-shirt1.webp', '/images/updated/t-shirt2.webp', '/images/updated/t-shirt3.webp', '/images/updated/t-shirt4.webp']
  };
  const aurum2Items = ['/images/women/new/category12.png', '/images/women/new/category9.png', '/images/women/new/category10.png', '/images/women/new/category11.png', '/images/women/new/category13.png', '/images/women/new/category14.png', '/images/women/new/category15.png', '/images/women/new/category16.png'];
  const twinBirdsMarquee = ['/images/women/new/category-1.png', '/images/women/new/category-2.png', '/images/women/new/category-3.png', '/images/women/new/category-4.png', '/images/women/new/category-5.png', '/images/women/new/category-6.png'];
  const attachBanners = ['/images/banners/attach-banner-1.png', '/images/banners/attach-banner-2.png', '/images/banners/attach-banner-3.png', '/images/banners/attach-banner-4.png'];
  const editorialImages = ['/images/updated/left.jpg', '/images/updated/center.jpg', '/images/updated/right.jpg'];
  const indianFlowerPicks = ['/images/women/new/zig-zag3.png', '/images/women/new/zig-zag1.png', '/images/women/new/zig-zag2.png', '/images/women/new/zig-zag4.png', '/images/women/new/zig-zag5.png'];
  const innerwearEssentials = ['/images/updated/inner1.jpg', '/images/updated/inner2.jpg', '/images/updated/inner3.jpg', '/images/updated/inner5.jpg'];
  const mensJockey = ['/images/home/jockey2.webp', '/images/home/jockey3.webp', '/images/home/jockey4.webp', '/images/home/jockey5.webp', '/images/home/jockey6.webp', '/images/home/jockey7.webp', '/images/home/jockey8.webp', '/images/home/jockey9.webp'];
  const mensDaily = ['/images/updated/men1.jpg', '/images/updated/men2.jpg', '/images/updated/men3.jpg', '/images/updated/men4.jpg', '/images/updated/men5.jpg', '/images/updated/men6.jpg', '/images/updated/men7.jpg'];
  return <>
      
      <div className={portalClass("home1-page-new-home")}>
        <div className={portalClass("admin-homepage-header")} style={{
        padding: '20px',
        background: "#ffffff",
        color: "#42536a",
        textAlign: 'center'
      }}>
          <h1 className="tadm-adminhomepageimages-node-1">Homepage Editor</h1>
          <p className="tadm-adminhomepageimages-node-2">Click any image to replace it.</p>
        </div>

        <div className={portalClass("spacer-new-home")}>
          
          {}
          <section className={portalClass("admin-section")}>
            <h2 className={portalClass("admin-section-title")}>1. Main Hero Banners</h2>
            <div className={portalClass("home1-hero-frame-new-home")}>
              <Swiper modules={[Autoplay, Pagination]} loop slidesPerView={1} autoplay={{
              delay: 3500
            }} pagination={{
              clickable: true
            }}>
                {mainHeroBanners.map((path, i) => {
                const slot = getSlot(path, `Hero ${i}`, 'Main Hero');
                return <SwiperSlide key={path}>
                      <div className={portalClass("main-hero-slide")}>
                        <EditableImage slotId={slot.id} section={slot.section} imageUrl={slot.imageUrl} defaultUrl={slot.defaultUrl} altText={slot.altText} onUpdated={handleUpdated} />
                      </div>
                    </SwiperSlide>;
              })}
              </Swiper>
            </div>
          </section>

          {}
          <section className={portalClass("admin-section")}>
            <h2 className={portalClass("admin-section-title")}>2. Women's Category Grid</h2>
            <div className={portalClass("admin-grid-4")}>
              {womenGrid.map((path, i) => {
              const slot = getSlot(path, `Women Grid ${i}`, 'Category Grid');
              return <div className={portalClass("admin-card-standard")} key={path}>
                    <EditableImage slotId={slot.id} section={slot.section} imageUrl={slot.imageUrl} defaultUrl={slot.defaultUrl} altText={slot.altText} onUpdated={handleUpdated} />
                  </div>;
            })}
            </div>
          </section>

          {}
          <section className={portalClass("admin-section")}>
            <div className={portalClass("cool4-shell")}>
              <h2 className={portalClass("admin-section-title")}>3. Stay Cool in Style (Tabs)</h2>
              <div className={portalClass("cool4-tabs")}>
                {Object.keys(coolImages).map(tab => <button key={tab} className={portalClass(`cool4-tab ${coolTab === tab ? 'is-active' : ''}`)} onClick={() => setCoolTab(tab)}>
                    {tab.toUpperCase()}
                  </button>)}
              </div>
              <div className={portalClass("admin-grid-4")}>
                {coolImages[coolTab].map((src, i) => {
                const slot = getSlot(src, `Cool ${coolTab} ${i}`, 'Cool Tabs');
                return <div className={portalClass("admin-card-standard")} key={src}>
                      <EditableImage slotId={slot.id} section={slot.section} imageUrl={slot.imageUrl} defaultUrl={slot.defaultUrl} altText={slot.altText} onUpdated={handleUpdated} />
                    </div>;
              })}
              </div>
            </div>
          </section>

          {}
          <section className={portalClass("admin-section")}>
            <h2 className={portalClass("admin-section-title")}>4. Women's Categories (Explore)</h2>
            <div className={portalClass("admin-grid-4")}>
              {aurum2Items.map((path, i) => {
              const slot = getSlot(path, `Aurum Category ${i}`, "Women's Categories");
              return <div className={portalClass("admin-card-standard")} key={path}>
                    <EditableImage slotId={slot.id} section={slot.section} imageUrl={slot.imageUrl} defaultUrl={slot.defaultUrl} altText={slot.altText} onUpdated={handleUpdated} />
                  </div>;
            })}
            </div>
          </section>

          {}
          <section className={portalClass("admin-section")}>
            <h2 className={portalClass("admin-section-title")}>5. Twin Birds Marquee (Remaining Items)</h2>
            <div className={portalClass("admin-grid-6")}>
              {twinBirdsMarquee.map((path, i) => {
              const slot = getSlot(path, `Marquee ${i}`, "Twin Birds Marquee");
              return <div className={portalClass("admin-card-square")} key={path}>
                    <EditableImage slotId={slot.id} section={slot.section} imageUrl={slot.imageUrl} defaultUrl={slot.defaultUrl} altText={slot.altText} onUpdated={handleUpdated} />
                  </div>;
            })}
            </div>
          </section>

          {}
          <section className={portalClass("admin-section")}>
            <h2 className={portalClass("admin-section-title")}>6. Popular Brands (Side Photo)</h2>
            <div style={{
            maxWidth: '400px',
            margin: '0 auto'
          }} className="tadm-adminhomepageimages-node-3">
              <div className={portalClass("admin-card-standard")}>
                <EditableImage slotId={'/images/contact-side.jpg'} section={'Popular Brands'} imageUrl={getSlot('/images/contact-side.jpg').imageUrl} defaultUrl={'/images/contact-side.jpg'} altText={'Contact Side'} onUpdated={handleUpdated} />
              </div>
            </div>
          </section>

          {}
          <section className={portalClass("admin-section")}>
            <h2 className={portalClass("admin-section-title")}>7. Secondary Banners (Attach Banners)</h2>
            <div className={portalClass("home1-hero-frame-new-home-2")}>
              <Swiper modules={[Autoplay]} loop slidesPerView={1} autoplay={{
              delay: 3500
            }}>
                {attachBanners.map((path, i) => {
                const slot = getSlot(path, `Attach Banner ${i}`, 'Secondary Banners');
                return <SwiperSlide key={path}>
                      <div className={portalClass("home1-hero-slide-new-home-2")}>
                        <EditableImage slotId={slot.id} section={slot.section} imageUrl={slot.imageUrl} defaultUrl={slot.defaultUrl} altText={slot.altText} onUpdated={handleUpdated} />
                      </div>
                    </SwiperSlide>;
              })}
              </Swiper>
            </div>
          </section>

          {}
          <section className={portalClass("admin-section")}>
            <h2 className={portalClass("admin-section-title")}>8. Editorial Images</h2>
            <div className={portalClass("admin-grid-3")}>
              {editorialImages.map((path, i) => {
              const slot = getSlot(path, `Editorial ${i}`, 'Editorial');
              return <div className={portalClass("admin-card-standard")} key={path}>
                    <EditableImage slotId={slot.id} section={slot.section} imageUrl={slot.imageUrl} defaultUrl={slot.defaultUrl} altText={slot.altText} onUpdated={handleUpdated} />
                  </div>;
            })}
            </div>
          </section>

          {}
          <section className={portalClass("admin-section")}>
            <h2 className={portalClass("admin-section-title")}>9. Indian Flower Picks (Zig-Zag)</h2>
            <div className={portalClass("admin-grid-5")}>
              {indianFlowerPicks.map((path, i) => {
              const slot = getSlot(path, `Indian Flower ${i}`, 'Indian Flower');
              return <div className={portalClass("admin-card-standard")} key={path}>
                    <EditableImage slotId={slot.id} section={slot.section} imageUrl={slot.imageUrl} defaultUrl={slot.defaultUrl} altText={slot.altText} onUpdated={handleUpdated} />
                  </div>;
            })}
            </div>
          </section>

          {}
          <section className={portalClass("admin-section")}>
            <h2 className={portalClass("admin-section-title")}>10. Innerwear Essentials</h2>
            <div className={portalClass("admin-grid-4")}>
              {innerwearEssentials.map((path, i) => {
              const slot = getSlot(path, `Innerwear ${i}`, 'Innerwear Essentials');
              return <div className={portalClass("admin-card-square")} key={path}>
                    <EditableImage slotId={slot.id} section={slot.section} imageUrl={slot.imageUrl} defaultUrl={slot.defaultUrl} altText={slot.altText} onUpdated={handleUpdated} />
                  </div>;
            })}
            </div>
          </section>

          {}
          <section className={portalClass("admin-section")}>
            <h2 className={portalClass("admin-section-title")}>11. Men's Essentials (Circles & Picks)</h2>
            <p style={{
            color: "#42536a",
            marginBottom: '15px'
          }} className="tadm-adminhomepageimages-node-4">Note: Changing these updates both the circle icons and the square cards on the frontend.</p>
            <div className={portalClass("admin-grid-6")}>
              {mensJockey.map((path, i) => {
              const slot = getSlot(path, `Jockey Mens ${i}`, 'Mens Essentials');
              return <div className={portalClass("admin-card-circle")} key={path}>
                    <EditableImage slotId={slot.id} section={slot.section} imageUrl={slot.imageUrl} defaultUrl={slot.defaultUrl} altText={slot.altText} onUpdated={handleUpdated} />
                  </div>;
            })}
            </div>
          </section>

          {}
          <section className={portalClass("admin-section")}>
            <h2 className={portalClass("admin-section-title")}>12. Men's Daily Essentials</h2>
            <div className={portalClass("admin-grid-4")}>
              {mensDaily.map((path, i) => {
              const slot = getSlot(path, `Mens Daily ${i}`, 'Mens Daily');
              return <div className={portalClass("admin-card-standard")} key={path}>
                    <EditableImage slotId={slot.id} section={slot.section} imageUrl={slot.imageUrl} defaultUrl={slot.defaultUrl} altText={slot.altText} onUpdated={handleUpdated} />
                  </div>;
            })}
            </div>
          </section>

        </div>
      </div>
    </>;
}
