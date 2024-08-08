import { useState } from 'react';
import process from 'process'
export default function Coupons({ index_id, store_data, coupon_data }) {
    const [couponShow, setCouponShow] = useState(false);
    const [feedbackShow, setFeedbackShow] = useState(false);
    const [feedbackValue, setFeedbackValue] = useState(false);
    const [copyTextShow, setCopyTextShow] = useState(false);
    const [dealTextShow, setDealTextShow] = useState(false);


    setTimeout(() => {
        if (process.browser) {
            var c_id = localStorage.getItem("copied_code")
            if (c_id) {
                setCouponShow(true)
                var feedback = localStorage.getItem("feedback_" + coupon_data.id)
                if (feedback) {
                    setFeedbackShow(true)

                }
                setFeedbackValue(feedback)
            } else {
                setCopyTextShow(false);
                setDealTextShow(false);
                setFeedbackShow(false)
                setFeedbackValue(false)
                setCouponShow(false)

            }

            if (c_id == coupon_data.id) {
                setCopyTextShow(true);
                setDealTextShow(true);
                setFeedbackShow(true);
                setTimeout(() => {
                    localStorage.removeItem("copied_code");

                }, 2000)

            }

        }
    }, 150)

    return (
        <>
            <div className="couponItem" key={index_id} id={`c=${coupon_data.id}`}>
                <div className="couponBox">
                    <div>
                        <div className="isverified">
                            <span className="storeName">{store_data.title} Coupon</span>
                            <span className="verifiedIcon">
                                <img src="/images/verified.svg" alt='verified-icon' width={14} height={14} />
                                <small>Verified</small>
                            </span>
                        </div>
                        <div className="couponDiscount">
                            {coupon_data.title != "" ? coupon_data.title : "Best Deal"}
                        </div>
                        <p className="couponDesc">
                            {coupon_data.content.replace(/<[^>]*>?/gm, '')}
                        </p>
                    </div>
                    {coupon_data.coupon_type == "code" ? <div className="couponBtn">
                        <button
                            className="codeLink"
                            onClick={async (e) => {
                                await localStorage.setItem('copied_code', coupon_data.id)
                                navigator.clipboard.writeText(coupon_data.coupon_code);
                                window.open(`/${store_data.slug}/#c=${coupon_data.id}`, "_blank");
                                window.open(store_data.affiliate_url, "_self");

                            }}
                        >
                            {couponShow ? coupon_data.coupon_code : coupon_data.coupon_code.replace(/(\w{3}).*/g, "$1" + (new Array(coupon_data.coupon_code.length - 3 + 1).join('*')))}

                        </button>
                        {copyTextShow && <div className="popover"> Code Copied ✅</div>}

                    </div> : <div className="couponBtn getDeal">
                        <button onClick={async (e) => {
                            await localStorage.setItem('copied_code', coupon_data.id)
                            window.open(`/${store_data.slug}`, "_blank");
                            window.open(store_data.affiliate_url, "_self");


                        }}>
                            Get Deal
                        </button>
                        {dealTextShow && <div className="popover"> Get Deal ✅</div>}

                    </div>}


                </div>
                {feedbackShow && <div className='feedBackBox' key={`feedback_${index_id}`}>
                    <div className='feedbackDetails'>
                        <div className='feedBacktext'>
                            {feedbackValue == "1" || feedbackValue == "2" ? <p>Thank you for your feedback 🙏</p>
                                : <p>Did this Coupon/Deal work?</p>}

                        </div>
                        <div className='feedBackBtns'>
                            <button type='button' className={feedbackValue == "2" && "selected"} disabled={(feedbackValue == "1" || feedbackValue == "2") && true} onClick={async (e) => {
                                await localStorage.setItem("feedback_" + coupon_data.id, "2")
                                setFeedbackValue("2")
                            }}>
                                <svg id="thumbsdownsvg" class="cursor-pointer stroke-current text-red-500 stroke-1 mx-1" width="18" height="16" viewBox="0 0 18 16" xmlns="http://www.w3.org/2000/svg" fill="white">
                                    <path d="M11.25 0.25H4.5C3.8775 0.25 3.345 0.625 3.12 1.165L0.855 6.4525C0.7875 6.625 0.75 6.805 0.75 7V8.5C0.75 9.325 1.425 10 2.25 10H6.9825L6.27 13.4275L6.2475 13.6675C6.2475 13.975 6.375 14.26 6.5775 14.4625L7.3725 15.25L12.315 10.3075C12.585 10.0375 12.75 9.6625 12.75 9.25V1.75C12.75 0.925 12.075 0.25 11.25 0.25ZM14.25 0.25V9.25H17.25V0.25H14.25Z" stroke=""></path>
                                </svg>
                                No
                            </button>
                            <button type="button" className={feedbackValue == "1" && "selected"} disabled={(feedbackValue == "1" || feedbackValue == "2") && true} onClick={async (e) => {
                                await localStorage.setItem("feedback_" + coupon_data.id, "1")
                                setFeedbackValue("1")
                            }}>

                                <svg id="thumbsupsvg" class="cursor-pointer stroke-current text-green-500 stroke-1 mx-1" width="18" height="16" viewBox="0 0 18 16" xmlns="http://www.w3.org/2000/svg" fill="white">
                                    <path d="M0.75 15.75H3.75V6.75H0.75V15.75ZM17.25 7.5C17.25 6.675 16.575 6 15.75 6H11.0175L11.73 2.5725L11.7525 2.3325C11.7525 2.025 11.625 1.74 11.4225 1.5375L10.6275 0.75L5.6925 5.6925C5.415 5.9625 5.25 6.3375 5.25 6.75V14.25C5.25 15.075 5.925 15.75 6.75 15.75H13.5C14.1225 15.75 14.655 15.375 14.88 14.835L17.145 9.5475C17.2125 9.375 17.25 9.195 17.25 9V7.5Z" stroke=""></path>
                                </svg>
                                Yes
                            </button>
                        </div>
                        <div className='feedBacktext'>
                            <p>
                                Your vote helps fellow shoppers save on their shopping
                            </p>
                        </div>
                    </div>
                </div>}

            </div>
        </>

    )

}
