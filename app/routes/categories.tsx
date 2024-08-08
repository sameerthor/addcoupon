import type { MetaFunction } from "@remix-run/node";
import { db } from "~/db.server";
import type { LoaderFunctionArgs } from "@remix-run/node"; // or cloudflare/deno
import { json } from "@remix-run/node"; // or cloudflare/deno
import { useLoaderData } from "@remix-run/react";
import { Link } from "@remix-run/react";
import { Image } from "@unpic/react";
import styles from "~/styles/categories.css?url";
import type { LinksFunction } from "@remix-run/node";
import moment from 'moment';

export const links: LinksFunction = () => [
    { rel: "stylesheet", href: styles },
];

export const meta: MetaFunction = () => {
    return [
        { title: "Addcoupons Categories - Get Verified Coupons, Promo Codes & Deals" },
        { name: "description", content: "Explore the Addcoupons category page now to unlock instant savings. We bring the latest coupon codes, promo offers, and discounts across a wide range of categories. Whether you are shopping for tech gadgets, fashion items, or planning your next vacation, we help you save big." },
    ];
};
export const loader = async ({
    params,
}: LoaderFunctionArgs) => {
    return json(
        await db.mysite_category.findMany({
            select: {
                title: true,
                slug: true,
                stores: {
                    include: {
                        store: {
                            select: {
                                title: true,
                                slug: true,
                                coupon_set: {
                                    select: {
                                        coupon_type: true
                                    }, // All posts where authorId == 20
                                }
                            }
                        }
                    }
                }
                ,
            }
        })
    );
};
export default function Index() {
    const categories = useLoaderData<typeof loader>();

    return (
        <>
             <section className="allCategories">
                <div className="container mx-auto sm:px-4">
                    {/* <h1>All Categories</h1> */}
                    <div className="flex flex-wrap ">
                        <div className="lg:w-3/4 pr-4 pl-4 p-0">
                            <div className="flex flex-wrap  catBox">
                                {categories.map((item, index) =>
                                    <div className="md:w-1/4 pr-4 pl-4 sm:w-1/2 pr-4 pl-4 p-1" key={index}>
                                        <Link className="catCard" to={`/category/${item.slug}`}>
                                            <div className="imgBox">
                                                {item.title}
                                            </div>
                                            <div className="dealCount">
                                                <span>
                                                    {item.stores.reduce((count, current) => count + current.store.coupon_set.filter(x => x.coupon_type == 'code').length, 0) > 0 && `${item.stores.reduce((count, current) => count + current.store.coupon_set.filter(x => x.coupon_type == 'code').length, 0)} Coupons`}  {item.stores.reduce((count, current) => count + current.store.coupon_set.filter(x => x.coupon_type == 'code').length, 0) > 0 && item.stores.reduce((count, current) => count + current.store.coupon_set.filter(x => x.coupon_type == 'deal').length, 0) > 0 ? <small>|</small> : ''} {item.stores.reduce((count, current) => count + current.store.coupon_set.filter(x => x.coupon_type == 'deal').length, 0) > 0 && `${item.stores.reduce((count, current) => count + current.store.coupon_set.filter(x => x.coupon_type == 'deal').length, 0)} Deals`}
                                                </span>
                                            </div>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="lg:w-1/4 pr-4 pl-4 w-full p-0">
                            <div className="catSidebar">
                                <div className="sidebarWidget catDesc">
                                    <div className="catHeading">
                                        <h2>All Categories</h2>
                                    </div>
                                    <div className="catValue">
                                        <p>Total Categories:</p>
                                        <h4>{categories.length} +</h4>
                                        <p>Total Coupon &amp; Offers:</p>
                                        <h4> {categories.reduce((count, current) => count + current.stores.reduce((count1, current1) => count1 + current1.store.coupon_set.length, 0), 0)} +</h4>
                                    </div>
                                    <div className="verifiedBox">
                                        <p className="text-center">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="#b9dc2f"
                                                width={16}
                                                height={16}
                                                viewBox="0 0 512 512"
                                            >
                                                <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" />
                                            </svg>
                                            Verified On: {moment().format("dddd, Do MMMM YYYY")}
                                        </p>
                                    </div>
                                </div>
                                <div className="sidebarWidget">
                                    <h2>Popular Merchants</h2>
                                    <ul>
                                        {categories.map((item) =>
                                            item.stores.map((item1, index) => {
                                                if (index == 0) {

                                                    return <li>
                                                        <Link to={`/${item1.store.slug}`}>{item1.store.title}</Link>
                                                    </li>
                                                }
                                            }))}

                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
