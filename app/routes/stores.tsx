import type { MetaFunction } from "@remix-run/node";
import { db } from "~/db.server";
import type { LoaderFunctionArgs } from "@remix-run/node"; // or cloudflare/deno
import { json } from "@remix-run/node"; // or cloudflare/deno
import { useLoaderData } from "@remix-run/react";
import { Link } from "@remix-run/react";
import { Image } from "@unpic/react";
import styles from "~/styles/stores.css?url";
import type { LinksFunction } from "@remix-run/node";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
];

export const meta: MetaFunction = () => {
  return [
    { title: "Addcoupons Stores - Discover Coupon Codes & Deals From Top Brands" },
    { name: "description", content: "Addcoupons makes it easy to find all the latest coupon codes, discounts, and deals from top retailers. Find a vast collection of exclusive deals, offers, and promo codes from your favorite brands. From fashion and beauty to electronics and home goods, we have coupons for all." },
  ];
};
export const loader = async ({
  params,
}: LoaderFunctionArgs) => {
  return json(
    await db.mysite_store.findMany({
        select: {
        title: true,
        slug: true,
        coupon_set:  { select: {
          coupon_type: true
                }, // All posts where authorId == 20
      },}
    })
  );
};
export default function Index() {
  const stores = useLoaderData<typeof loader>();
  const alphabet = "abcdefghijklmnopqrstuvwxyz";

  return (
    <>
       <section className="allStorePage">
                <div className="container mx-auto sm:px-4">
                    <div className="storeBox">
                        <div className="alpha-store">
                            <h1 className="text-center">All Stores</h1>
                            <div>
                                <p className="all_list">
                                    <button type="button" className="getStore" onClick={(e) => {
                                        e.preventDefault();
                                        window.scrollTo({
                                            top: document.querySelector("#zeroToNine").offsetTop - 30,
                                            behavior: "smooth",
                                        });
                                    }} >0-9</button>
                                    {alphabet.split("").map((c) =>

                                        <button type="button" onClick={(e) => {
                                            e.preventDefault();
                                            window.scrollTo({
                                                top: document.querySelector("#alpha" + c.toUpperCase()).offsetTop - 30,
                                                behavior: "smooth",
                                            });
                                        }} className="getStore" >{c.toUpperCase()}</button>
                                    )}
                                </p>
                            </div>
                            <div className="storeList" id="zeroToNine">

                                <ul>
                                    {stores
                                        .filter((store) => store.title.toLowerCase().startsWith('#') || store.title.toLowerCase().startsWith('0') || store.title.toLowerCase().startsWith('1') || store.title.toLowerCase().startsWith('2') || store.title.toLowerCase().startsWith('3') || store.title.toLowerCase().startsWith('4') || store.title.toLowerCase().startsWith('5') || store.title.toLowerCase().startsWith('6') || store.title.toLowerCase().startsWith('7') || store.title.toLowerCase().startsWith('8') || store.title.toLowerCase().startsWith('9'))
                                        .map((item, index) => (
                                            <li key={index}><Link to={`/${item.slug}`}>{item.title}<span>{item.coupon_set.filter(item => item.coupon_type == "deal").length > 0 ? `${item.coupon_set.filter(item => item.coupon_type == "deal").length} deals` : ""} {item.coupon_set.filter(item => item.coupon_type == "deal").length > 0 && item.coupon_set.filter(item => item.coupon_type == "code").length > 0 ?"&":""} {item.coupon_set.filter(x => x.coupon_type == 'code').length > 0 && `${item.coupon_set.filter(x => x.coupon_type == 'code').length} codes`}</span></Link></li>

                                        ))}

                                </ul>
                            </div>
                            {alphabet.split("").map((c) => {
                                return (
                                    <>
                                        <div className="storeList" id={`alpha${c.toUpperCase()}`}>

                                            <ul>
                                                {stores
                                                    .filter((store) => store.title.toLowerCase().startsWith(c))
                                                    .map((item, index) => (
                                                        <li key={index}><Link to={`/${item.slug}`}>{item.title}<span>{item.coupon_set.filter(item => item.coupon_type == "deal").length > 0 ? `${item.coupon_set.filter(item => item.coupon_type == "deal").length} deals` : ""} {item.coupon_set.filter(item => item.coupon_type == "deal").length > 0 && item.coupon_set.filter(item => item.coupon_type == "code").length > 0 ?"&":""} {item.coupon_set.filter(x => x.coupon_type == 'code').length > 0 && `${item.coupon_set.filter(x => x.coupon_type == 'code').length} codes`}</span></Link></li>

                                                    ))}

                                            </ul>
                                        </div>

                                    </>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>
    </>
  );
}
