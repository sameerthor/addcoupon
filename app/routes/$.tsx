import type { MetaFunction } from "@remix-run/node";
import { db } from "~/db.server";
import type { LoaderFunctionArgs } from "@remix-run/node"; // or cloudflare/deno
import { json } from "@remix-run/node"; // or cloudflare/deno
import { useLoaderData } from "@remix-run/react";
import { Link } from "@remix-run/react";
import { Image } from "@unpic/react";
import styles from "~/styles/store.css?url";
import type { LinksFunction } from "@remix-run/node";
import moment from 'moment';
import reactStringReplace from 'react-string-replace';
import { renderToString } from 'react-dom/server';
import _ from 'lodash';
import Coupon from '../components/coupons';
import RatingBox from '../components/ratingbox';


export const links: LinksFunction = () => [
    { rel: "stylesheet", href: styles },
];

export const meta: MetaFunction<typeof loader> = ({
    data,
  }) =>{
    return [
        { title: data.store.seo_title.replaceAll("%%Year%%", moment().format('YYYY')).replaceAll("%%CurrentMonth%%", moment().format('MMMM')) },
        { name: "description", content: data.store.seo_description },
    ];
};
export const loader = async ({
    params,
}: LoaderFunctionArgs) => {
    var store = await db.mysite_store.findUnique({
        where: {
            slug: params['*']
        },
        include: {
            coupon_set: true, // All posts where authorId == 20
            rating:true,
            categories: {include:{category:true}}
        }
    });
    var simCat = [];
    if (store.categories[0]) {
        var relStores = await db.mysite_store.findMany({
            orderBy: [
                {
                    id: 'desc'
                }
            ],
            where: {
                categories: {

                    every: {
                        id: store.categories[0].category_id
                    },
                }
            }})
        relStores = _.shuffle(relStores).slice(0, 12)
        if (relStores.length <= 3) {
            simCat = await db.mysite_category.findMany({
                skip: Math.ceil(parseInt(store.categories[0].category_id) / 4),
                take: 4,
            })

        }

    } else {
        var relStores = [];
    }

    return json(
        { store: store, relStores: relStores, simCat: simCat }
    );
};
export default function Index() {
    const { store, relStores,simCat } = useLoaderData<typeof loader>();
  
    const store_names = relStores.filter(f => f.id !== store.id).slice(0, 2).map(item => `<a href="/${item.slug}">${item.title}</a>`)

    store.store_description = store.store_description.replaceAll("%%storename%%", store.title);
    store.store_description = store.store_description.replaceAll("%pe­rcentage% off", store.coupon_set[0].title);
    store.store_description = store.store_description.replaceAll("%percentage% off", store.coupon_set[0].title);
    store.store_description = store.store_description.replaceAll("%pe­rcentage% Off", store.coupon_set[0].title);
    store.store_description = store.store_description.replaceAll("%percentage% Off", store.coupon_set[0].title);
    store.store_description = store.store_description.replaceAll("%pe­rcentage% OFF", store.coupon_set[0].title);
    store.store_description = store.store_description.replaceAll("%percentage% OFF", store.coupon_set[0].title);
    store.store_description = store.store_description.replaceAll("%pe­rcentage%", store.coupon_set[0].title);
    store.store_description = store.store_description.replaceAll("%percentage%", store.coupon_set[0].title);
    store.store_description = store.store_description.replace(/XX/, store.coupon_set.length);
    store.store_description = store.store_description.replace(/XXX/, store.coupon_set.filter(x => x.coupon_type == 'code').length > 0 ? store.coupon_set.filter(x => x.coupon_type == 'code')[0].coupon_code : "");
    store.store_description = store.store_description.replaceAll("%%currentmonth%%", moment().format('MMMM'));
    store.store_description = store.store_description.replaceAll("%%curre­ntmonth%%", moment().format('MMMM'));
    store.store_description = store.store_description.replaceAll("%%currentyear%%", moment().format('YYYY'));
    store.store_description = store.store_description.replaceAll("currentyear%%", moment().format('YYYY'));
    store.store_description = store.store_description.replaceAll(/%%categorystore%% and %%categorystore%%|%categorystore%, %categorystore%, and %categorystore%|%categorystore%, %categorystore%|%categorystore% and %categorystore%|%%categorystore%%, %%categorystore%%|%categorystore%, %categorystore%, %categorystore%|%categorystore% %categorystore%, %categorystore%|%categorystore% %categorystore% %categorystore%|%categorystore% %categorystore% and %categorystore%/gi, store_names.join(", "));
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [{
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://anddeals.com"
        }, store.categories.length > 0 ? {
            "@type": "ListItem",
            "position": 2,
            "name": store.categories[0].category.title,
            "item": "https://anddeals.com/category/" + store.categories[0].category.slug
        } : '', {
            "@type": "ListItem",
            "position": store.categories.length > 0 ? 3 : 2,
            "name": store.title
        }]
    }

    const regex1 = /(.*[\s+\"\']faq_question[\s+\"\'].*)/g;
    var questions = [];
    var answers = [];
    let m
    while ((m = regex1.exec(store.extra_info)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex1.lastIndex) {
            regex1.lastIndex++;
        }

        // The result can be accessed through the `m`-variable.
        m.forEach((match, groupIndex) => {
            if (groupIndex == 0)
                questions.push(match.replace(/<[^>]+>/g, ''));
        });
    }
    const regex2 = /(.*[\s+\"\']faq_answer[\s+\"\'].*)/g

    while ((m = regex2.exec(store.extra_info)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex2.lastIndex) {
            regex2.lastIndex++;
        }

        // The result can be accessed through the `m`-variable.
        m.forEach((match, groupIndex) => {
            if (groupIndex == 0)
                answers.push(match.replace(/<[^>]+>/g, ''));
        });
    }

    const jsonQD = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": questions.map((item, ind) => {
            return {
                "@type": "Question",
                "name": item,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": answers[ind]
                }
            }
        })
    }
    return (
        <>
           <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {questions.length > 0 && <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonQD) }}
            />}
            <section className="storePage">
                <div className="container mx-auto sm:px-4">
                    <div className="breadcrumb">
                        <ul>
                            <li>
                                <Link to="/">Home</Link> /
                            </li>
                            {store.categories.length > 0 &&

                                <li>
                                    <Link to={`/category/${store.categories[0].category.slug}`}>{store.categories[0].category.title}</Link> /
                                </li>
                            }
                            <li>{store.title}</li>
                        </ul>
                        <div className="share">
                            <div>
                                <button type="button" className="shareBtn" name='shareButton' title="Share this coupon">
                                    <svg
                                        className="mb-2 font-medium leading-tight text-xl w-4 inline"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        width={12}
                                        height={12}
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                                        />
                                    </svg>
                                </button>
                            </div>
                            <div className="shareSocialLinks">
                                <a href="#">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 512 512"
                                        width={16}
                                        height={16}
                                        fill="#1877F2"
                                    >
                                        <path d="M512 256C512 114.6 397.4 0 256 0S0 114.6 0 256C0 376 82.7 476.8 194.2 504.5V334.2H141.4V256h52.8V222.3c0-87.1 39.4-127.5 125-127.5c16.2 0 44.2 3.2 55.7 6.4V172c-6-.6-16.5-1-29.6-1c-42 0-58.2 15.9-58.2 57.2V256h83.6l-14.4 78.2H287V510.1C413.8 494.8 512 386.9 512 256h0z" />
                                    </svg>
                                </a>
                                <a href="#">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 448 512"
                                        width={16}
                                        height={16}
                                        fill="#25D366"
                                    >
                                        <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
                                    </svg>
                                </a>
                                <a href="#">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 512 512"
                                        width={16}
                                        height={16}
                                        fill="#000"
                                    >
                                        <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap  storeHeader">
                        <div className="w-3/4 p-0">
                            <div>
                                <h1 className="storeTitle">
                                    {store.store_h1.replaceAll("%%Year%%", moment().format('YYYY')).replaceAll("%%CurrentMonth%%", moment().format('MMMM'))}
                                </h1>
                                <div className="avlDeals">
                                    <h2>{store.coupon_set.filter(x => x.coupon_type == 'code').length > 0 && `${store.coupon_set.filter(x => x.coupon_type == 'code').length} Coupons`} {store.coupon_set.filter(x => x.coupon_type == 'code').length > 0 && store.coupon_set.filter(x => x.coupon_type == 'deal').length > 0 ? "&" : ''} {store.coupon_set.filter(x => x.coupon_type == 'deal').length > 0 && `${store.coupon_set.filter(x => x.coupon_type == 'deal').length} Deals`} Available</h2>
                                </div>
                                {store.coupon_set &&
                                    <div className="topdisc">
                                        <p>{store.coupon_set[0].title} at {store.title}</p>
                                    </div>
                                }
                            </div>
                        </div>
                        <div className="w-1/4 p-0">
                            <div className="sideBanner">
                                <div className="bannerImg">
                                    <a href="#">
                                        <img
                                            width="100"
                                            height={100}
                                            src={`${process.env.IMAGE_URL}/${store.image}`}
                                            alt={`${store.title.trim()} Coupon Code`}
                                            title={`${store.title.trim()}`}
                                        />
                                    </a>
                                </div>
                                <RatingBox key={'store_' + store.id} store={store} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container mx-auto sm:px-4 mt-2">
                    <div className="flex flex-wrap ">
                        <div className="md:w-full pr-4 pl-4 p-0">
                            <div className="storBox">
                                {/* <div class="storeTab">
                     <a href="#" class="active">All (27)</a>
                     <a href="#">Coupons (20)</a>
                     <a href="#">Deal (7)</a>
                  </div> */}
                                {store.coupon_set.length > 0 && store.coupon_set.sort(function (a, b) {
                                    return a.coupon_type !== null ? a.coupon_type.localeCompare(b.coupon_type) : a;
                                }).map((item, index) =>
                                    <Coupon key={index} store_data={_.omit(store, 'coupon_set')} coupon_data={item} />
                                )}

                            </div>

                            <div className="storeContent">
                                <div className="couponSummary" dangerouslySetInnerHTML={{
                                    __html: reactStringReplace(store.store_description, '[offer-table]', (match, i) => (
                                        renderToString(<div className="offerToday">
                                            <h3>Today's {store.title} Offer</h3>
                                            <table>
                                                <tbody>
                                                    <tr>
                                                        <td>🛍️ Total Offers</td>
                                                        <td className="text-right font-medium">{store.coupon_set && store.coupon_set.length}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>🏷️ Active Coupon Codes</td>
                                                        <td className="text-right font-medium">{store.coupon_set.filter(x => x.coupon_type == 'code').length}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>🛒 Free Shipping</td>
                                                        <td className="text-right font-medium">{store.coupon_set.filter(x => x.title.toLowerCase().includes("shipping")).length}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>🔥 Best Offer</td>
                                                        <td className="text-right font-medium">Flat {store.coupon_set && store.coupon_set[0].title}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>)
                                    )).join("")
                                }} >
                                </div>

                                <div className="tableContainer">
                                    <table border="1" cellSpacing="0" cellPadding="0">
                                        <tbody>
                                            <tr>
                                                <td width="20%"><strong>Deal</strong></td>
                                                <td width="60%"><strong>Title</strong></td>
                                                <td width="20%"><strong>Coupon</strong></td>
                                            </tr>
                                            {store.coupon_set.map((item, index) =>
                                                <tr key={index}>
                                                    <td>{item.title != "" ? item.title : "Best Deal 👌"}</td>
                                                    <td dangerouslySetInnerHTML={{ __html: item.content }}></td>
                                                    <td>{item.coupon_type == "code" ? item.coupon_code : "Hot Deal ️‍🔥"}</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="faqs" dangerouslySetInnerHTML={{ __html: store.extra_info }}>

                                </div>
                                {relStores.length > 3 ? <div className="storeWidget">
                                    <h4 className="widgetHeading">Similar Stores</h4>
                                    <div className="topStore">
                                        <ul>
                                            {relStores.map((item, index) => {
                                                if (item.id !== store.id)
                                                    return <li key={index}>
                                                        <Link to={false} href={`/${item.slug}`}>{item.title}</Link>
                                                    </li>
                                            }
                                            )}


                                        </ul>
                                    </div>
                                </div> : <div className="storeWidget">
                                    <h4 className="widgetHeading">Similar Categories</h4>
                                    <div className="topStore">
                                        <ul>
                                            {simCat.map((item, index) => {
                                                return <li key={index}>
                                                    <Link  to={`/category/${item.slug}`}>{item.title}</Link>
                                                </li>
                                            }
                                            )}


                                        </ul>
                                    </div>
                                </div>}


                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Subscribe */}
            <section className="subscribeBox">
                <div className="subscribeBoxInner">
                    <div className="flex flex-wrap  items-center">
                        <div className="md:w-3/5 pr-4 pl-4 p-0">
                            <div className="subscribeImg">
                                <Image
                                    height={100} width={100} src="/images/subscribe-andDeals.png" loading="lazy" alt="subscribe" />
                                <h4>Subscibe to get hot 🔥 deals &amp; daily discount coupons.</h4>
                            </div>
                        </div>
                        <div className="md:w-2/5 pr-4 pl-4 p-0">
                            <div className="subcribeForm">
                                <form action="#someWhere">
                                    <div className="inputBox">
                                        <span>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width={18}
                                                height={18}
                                                fill="currentColor"
                                                className="bi bi-person"
                                                viewBox="0 0 16 16"
                                            >
                                                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" />
                                            </svg>
                                        </span>
                                        <input
                                            type="text"
                                            className="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded"
                                            placeholder="Your Name"
                                        />
                                    </div>
                                    <div className="inputBox">
                                        <span>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width={18}
                                                height={18}
                                                fill="currentColor"
                                                className="bi bi-envelope"
                                                viewBox="0 0 16 16"
                                            >
                                                <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z" />
                                            </svg>
                                        </span>
                                        <input
                                            type="email"
                                            className="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded"
                                            placeholder="Your Email"
                                            required=""
                                        />
                                    </div>
                                    <small>
                                        We do care about your data. Read our{" "}
                                        <a href="#" title="visit our privacy policy">privacy policy</a> for more information.
                                    </small>
                                    <div className="subscribeBtn">
                                        <button name="subscribe" title="subscribe">Subscribe</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
