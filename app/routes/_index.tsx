import type { MetaFunction } from "@remix-run/node";
import { db } from "~/db.server";
import type { LoaderFunctionArgs } from "@remix-run/node"; // or cloudflare/deno
import { json } from "@remix-run/node"; // or cloudflare/deno
import { useLoaderData } from "@remix-run/react";
import { Link } from "@remix-run/react";
import { Image } from "@unpic/react";
import styles from "~/styles/home.css?url";
import type { LinksFunction } from "@remix-run/node";
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader

import banner1 from "/images/udemy-banner.png";
import banner2 from "/images/reebok-banner.png";
import banner3 from "/images/fashion-banner.png";
import banner4 from "/images/pizza-banner.png";
import banner5 from "/images/travell-banner.png";
import banner6 from "/images/Skin-Care-banner.png";
import banner7 from "/images/furniture-banner.png";
import banner8 from "/images/sports-fitness-banner.png";


export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
];

export const meta: MetaFunction = () => {
  return [
    { title: "Addcoupons - Save More With The Best Coupon Codes & Deals" },
    { name: "description", content: "Addcoupons is your one-stop shop for the latest coupon codes, promo codes, and discounts. Here, you will discover exclusive offers, discount codes, and promo offers available on the internet. All our coupons and deals are 100% working. Start saving today!" },
  ];
};
export const loader = async ({
  params,
}: LoaderFunctionArgs) => {
  return json(
    await db.mysite_store.findMany({
      where: {
        home_options: { in: ['1', '2', '3', '4'] },
      },
      include: {
        coupon_set: true, // All posts where authorId == 20
      },
    })
  );
};
export default function Index() {
  const stores = useLoaderData<typeof loader>();

  return (
    <>
      <section className="homeBanner">
        <div className="container mx-auto sm:px-4">
          <div className="banner-slider carousel-wrapper">
            <Carousel showThumbs={false} infiniteLoop={true} showStatus={false}>
              <div className="carousel-slide">
                <a href="/udemy">
                  <Image src={banner1} priority={true} width={600}
                    height={300}
                      
                    alt="" />
                  <span className="sliderName">Udemy</span>
                  <div className="overlay"></div>

                </a>
                <a href="/reebok">
                  <Image src={banner2} priority={true} width={600}
                    height={300}
                    alt="" />
                  <span className="sliderName">Reebok</span>
                  <div className="overlay"></div>
                </a>
                <a href="/category/fashion-accessories">
                  <Image src={banner3} priority={true} width={600}
                    height={300}
                      
                    alt="" />
                  <span className="sliderName">Fashion</span>
                  <div className="overlay"></div>
                </a>
                <a href="/dominos">
                  <Image src={banner4} priority={true} width={600}
                    height={300}
                   
                    alt="" />
                  <span className="sliderName">Domino's</span>
                  <div className="overlay"></div>
                </a>
              </div>
              <div className="carousel-slide">
                <a href="/booking">
                  <Image src={banner5} width={600}
                    height={300}
                      
                    alt="" />
                  <span className="sliderName">Booking.com</span>
                  <div className="overlay"></div>
                </a>
                <a href="/category/beauty-and-health">
                  <Image src={banner6} width={600}
                    height={300}
                      
                    alt="" />
                  <span className="sliderName">Skin Care</span>
                  <div className="overlay"></div>
                </a>
                <a href="/category/bedding-and-mattresses" className="megaSale">
                  <Image src={banner7} width={600}
                    height={300}
                      
                    alt="" />
                  <span className="sliderName">Furniture</span>
                  <div className="overlay"></div>
                </a>
                <a href="/category/fitness">
                  <Image src={banner8} width={600}
                    height={300}
                      
                    alt="" />
                  <span className="sliderName">Sports & Fitness</span>
                  <div className="overlay"></div>
                </a>
              </div>
            </Carousel>
          </div>
        </div>
      </section>
      <div className="container mx-auto sm:px-4 max-w-full mx-auto sm:px-4 exclusive">
        <div className="container mx-auto sm:px-4">
          <h2>Exclusive Deals &amp; Promocodes</h2>
          <div className="flex flex-wrap ">
            {stores.map((store) => store.home_options == 1 &&
              <div className="lg:w-1/4 pr-4 pl-4 md:w-1/3 pr-4 pl-4 sm:w-1/2 pr-4 pl-4 exclusive-box">
                <Link to={`/${store.slug}`} className="exclusiveItem">
                  <div className="circle">
                    <Image loading="lazy"
                      width={100}
                      height={100}
                      src={`${process.env.IMAGE_URL}/${store.image}`}
                      alt={`${store.image_alt}`}
                    />
                  </div>
                  <div className="storeDealCount">
                    <p>{store.title}</p>
                    <span>{store.coupon_set.length} Deals</span>
                  </div>
                </Link>
              </div>
            )}
          </div>
          {/* <div className="more-btn text-center">
                        <button onClick={() => Router.push('/stores/')}>
                            View More
                        </button>
                    </div> */}
        </div>
      </div>
      {/* Top Deals on fav stores */}
      <section className="favDeals">
        <div className="container mx-auto sm:px-4">
          <h2>Top deals from favourite stores</h2>
          <div className="deal-slider">
            <div className="flex flex-wrap ">
              {stores.map((store) => store.home_options == 2 &&
                <div className="lg:w-1/4 pr-4 pl-4 md:w-1/3 pr-4 pl-4 sm:w-1/2 pr-4 pl-4 mb-3">
                  <Link to={`/${store.slug}`} className="dealBox">
                    <div className="dealImg">
                      <Image loading="lazy"
                        width={100}
                        height={100}
                        src={`${process.env.IMAGE_URL}/${store.image}`}
                        alt={`${store.image_alt}`}
                      />
                    </div>
                    <p className="dealName">{store.title}</p>
                    <div className="dealDesc" dangerouslySetInnerHTML={{ __html: store.coupon_set[0].content }}>
                    </div>
                    <span className="dealBtn">{store.coupon_set[0].discount_value}</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <section className="trandingDeals">
        <div className="container mx-auto sm:px-4 p-0">
          <div className="trandingHeading">
            <h2>Trending Deals</h2>
            <Link to="/stores">Explore More</Link>
          </div>
          <div className="flex flex-wrap ">
            {stores.map((store) => store.home_options == 3 &&
              <div className="lg:w-1/4 pr-4 pl-4 md:w-1/2 pr-4 pl-4 sm:w-1/2 pr-4 pl-4 w-full  mb-3">
                <Link className="trandingDealbox" to={`/${store.slug}`}>
                  <div className="imgbox">
                    <Image loading="lazy"
                      src={`${process.env.IMAGE_URL}/${store.image}`}
                      alt={`${store.image_alt}`}
                      width={100}
                      height={100}
                    />
                  </div>
                  <div className="dealInfo">
                    <h4 dangerouslySetInnerHTML={{ __html: store.coupon_set[0].content }}></h4>
                  </div>
                  <span className="grabDeal">
                    Grab Deal
                    <svg
                      width={16}
                      fill="#fff"
                      height={16}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                    >
                      <path d="M470.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 256 265.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160zm-352 160l160-160c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L210.7 256 73.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0z" />
                    </svg>
                  </span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
      {/* popular stores */}
      <section className="popularSection">
        <div className="container mx-auto sm:px-4">
          <h2>Popular Brands</h2>
          <div className="popularStore">
            <div className="flex flex-wrap  row-cols-2">
              {stores.map((store) => store.home_options == 4 &&
                <div className="lg:w-1/4 pr-4 pl-4 md:w-1/3 pr-4 pl-4 sm:w-1/2 pr-4 pl-4 mb-3">
                  <Link to={`/${store.slug}`} className="popularBox">
                    <div className="imgBox">
                      <Image loading="lazy"
                        width={100}
                        height={100}
                        src={`${process.env.IMAGE_URL}/${store.image}`}
                        alt={`${store.image_alt}`}
                      />                </div>
                    <div className="dealCount">
                      <span>View {store.coupon_set.length} Coupons</span>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
