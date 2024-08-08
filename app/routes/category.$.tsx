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
import _ from 'lodash'

export const links: LinksFunction = () => [
    { rel: "stylesheet", href: styles },
];

export const meta: MetaFunction<typeof loader> = ({
    data,
  }) =>{
    return [
        { title: data.category.meta_title.replace("%%currentyear%%", moment().format('YYYY')) },
        { name: "description", content: data.category.meta_description.replace("%%stores%%", _.map(data.category.stores.sort(function (a, b) {
            return b.store.coupon_set.length - a.store.coupon_set.length;
        }).slice(0, 3), 'title').join(', ') + ".") },
    ];
};
export const loader = async ({
    params,
}: LoaderFunctionArgs) => {
    var category = await db.mysite_category.findUnique({
        where: {
            slug: params['*']
        },
        select: {
            title: true,
            slug: true,
            meta_title:true,
            meta_description:true,
            stores: {
                include: {
                    store: {
                        select: {
                            title: true,
                            slug: true,
                            image:true,
                            coupon_set: {
                                select: {
                                    title: true,
                                    coupon_type: true
                                }, // All posts where authorId == 20
                            }
                        }
                    }
                }
            }
            ,
        }
    });
    var categories = await db.mysite_category.findMany({

        select: {
            title: true,
            slug: true,

        }
    });
    return json(
        { category: category, categories: categories }
    );
};
export default function Index() {
    const { category, categories } = useLoaderData<typeof loader>();

    return (
        <>
            <section className="storePage">
                <div className="container breadcrumb mx-auto sm:px-4">
                    <div className="">
                        <ul>
                            <li>
                                <Link to="/">andDeals.com</Link> /
                            </li>
                            <li>
                                <Link to="/categories">categories</Link> /
                            </li>
                            <li>{category.title}</li>
                        </ul>
                    </div>
                </div>
                <div className="container mx-auto sm:px-4 mt-4">
                    <div className="flex flex-wrap ">
                        <h1 className="pageHeading">
                            Best {category.title} Coupons &amp; Deals for {moment().format("MMMM YYYY")}
                        </h1>
                        <div className="subCatBox">
                            <div className="flex flex-wrap ">
                                <div className="lg:w-1/4 pr-4 pl-4">
                                    <div className="offerToday">
                                        <h3>Today's {category.title} Offers</h3>
                                        <table>
                                            <tbody>
                                                <tr>
                                                    <td>🛍️ Total Offers</td>
                                                    <td className="text-right">{category.stores.reduce((count, current) => count + current.store.coupon_set.length, 0)}</td>
                                                </tr>
                                                <tr>
                                                    <td>🏷️ Active Coupon Codes</td>
                                                    <td className="text-right">{category.stores.reduce((count, current) => count + current.store.coupon_set.filter(x => x.coupon_type == 'code').length, 0)}</td>
                                                </tr>
                                                <tr>
                                                    <td>🛒 Free Shipping</td>
                                                    <td className="text-right">{category.stores.reduce((count, current) => count + current.store.coupon_set.filter(x => x.title.toLowerCase().includes("shipping")).length, 0)}</td>
                                                </tr>

                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="similarStore">
                                        <h3 className="widgetHeading">Similar Categories</h3>
                                        {categories.map((item, index) =>
                                            <li key={index}>
                                                <Link to={`/category/${item.slug}`}>{item.title}</Link>
                                            </li>
                                        )}

                                    </div>
                                </div>
                                <div className="lg:w-3/4 pr-4 pl-4 p-0">
                                    <div className="flex flex-wrap ">
                                        {category.stores.map(item =>
                                            <div className='md:w-1/4 pr-4 pl-4'>
                                                <Link to={`/${item.store.slug}`} className="storeBox">
                                                    <div className="imgBox">
                                                        <img src={`${process.env.IMAGE_URL}/${item.store.image}`} alt="" />
                                                    </div>
                                                    <div className="dealCount">
                                                        <span>View {item.store.coupon_set.length} Coupons</span>
                                                    </div>
                                                </Link>
                                            </div>
                                        )

                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* ============= */}
                        {/* <div className="flex list-reset pl-0 rounded">
                            <ul>
                                <li>
                                    <a href="#" className="active">
                                        1
                                    </a>
                                </li>
                                <li>
                                    <a href="#">2</a>
                                </li>
                                <li>
                                    <a href="#">3</a>
                                </li>
                                <li>
                                    <a href="#">...</a>
                                </li>
                                <li>
                                    <a href="#">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={16}
                                            height={16}
                                            fill="currentColor"
                                            className="bi bi-chevron-double-right"
                                            viewBox="0 0 16 16"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708"
                                            />
                                            <path
                                                fillRule="evenodd"
                                                d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708"
                                            />
                                        </svg>
                                    </a>
                                </li>
                            </ul>
                        </div> */}
                    </div>
                </div>
            </section>
        </>
    );
}
