import {  useState } from 'react';
import { Rating } from 'react-simple-star-rating'
import process from 'process'


export default function RatingBox({store}) {
    var store_rating = 0;
    var total_ratings = 0;
    if (store.rating.length > 0) {
        store_rating = ((5 * store.rating[0].five + 4 * store.rating[0].four + 3 * store.rating[0].three + 2 * store.rating[0].two + 1 * store.rating[0].one) / (store.rating[0].five + store.rating[0].four + store.rating[0].three + store.rating[0].two + store.rating[0].one)).toFixed(1)
        total_ratings = store.rating[0].five + store.rating[0].four + store.rating[0].three + store.rating[0].two + store.rating[0].one
    }
    const [rating, setRating] = useState(store_rating)
    const [totalRatings, setTotalRatings] = useState(total_ratings)
    const [modalOpen, setModalOpen] = useState(false);

    if (process.browser)
        var user_rating = localStorage.getItem(store.id + "_rating") || 0
    else
        var user_rating = 0;

console.log("r",user_rating)
    const [userRating, setUserRating] = useState(user_rating)
    const [rateAlready, setRateAlready] = useState(user_rating == 0 ? false : true)

    // Catch Rating value
    const handleRating = (rate) => {
        setUserRating(rate)
    }

    const handleSubmit = async () => {
        if (userRating == 0) {
            alert("Please give rating first!")
            return false;
        }
        if (store.rating.length == 0) {
            setRating(userRating)
            setTotalRatings(1)
        } else {
            switch (userRating) {
                case 1:
                    setTotalRatings(totalRatings + 1);
                    setUserRating(((5 * store.rating[0].five + 4 * store.rating[0].four + 3 * store.rating[0].three + 2 * store.rating[0].two + 1 * (store.rating[0].one + 1)) / (store.rating[0].five + store.rating[0].four + store.rating[0].three + store.rating[0].two + store.rating[0].one + 1)).toFixed(1))
                    break;
                case 2:
                    setTotalRatings(totalRatings + 1);
                    setUserRating(((5 * store.rating[0].five + 4 * store.rating[0].four + 3 * store.rating[0].three + 2 * (store.rating[0].two + 1) + 1 * store.rating[0].one) / (store.rating[0].five + store.rating[0].four + store.rating[0].three + store.rating[0].two + store.rating[0].one + 1)).toFixed(1))
                    break;
                case 3:
                    setTotalRatings(totalRatings + 1);
                    setUserRating(((5 * store.rating[0].five + 4 * store.rating[0].four + 3 * (store.rating[0].three + 1) + 2 * store.rating[0].two + 1 * store.rating[0].one) / (store.rating[0].five + store.rating[0].four + store.rating[0].three + store.rating[0].two + store.rating[0].one + 1)).toFixed(1))
                    break;
                case 4:
                    setTotalRatings(totalRatings + 1);
                    setUserRating(((5 * store.rating[0].five + 4 * (store.rating[0].four + 1) + 3 * store.rating[0].three + 2 * store.rating[0].two + 1 * store.rating[0].one) / (store.rating[0].five + store.rating[0].four + store.rating[0].three + store.rating[0].two + store.rating[0].one + 1)).toFixed(1))
                    break;
                case 5:
                    setTotalRatings(totalRatings + 1);
                    setUserRating(((5 * (store.rating[0].five + 1) + 4 * store.rating[0].four + 3 * store.rating[0].three + 2 * store.rating[0].two + 1 * store.rating[0].one) / (store.rating[0].five + store.rating[0].four + store.rating[0].three + store.rating[0].two + store.rating[0].one + 1)).toFixed(1))
                    break;

            }
        }
        try {
     
            const res = await fetch('/api/rating', {
                method: 'POST',
                body: JSON.stringify({ "rating": { "itemId": store.id, "values": [userRating] } }),
                headers: {
                    'content-type': 'application/json'
                }
            })
            console.log(res)
            if (res.ok) {
                //  console.log("Yeai!")
            } else {
                //  console.log("Oops! Something is wrong.")
            }
        } catch (error) {
            console.log(error)
        }
     
        setModalOpen(false);
        localStorage.setItem(store.id + "_rating", userRating)
        setRateAlready(true)
    }

    return (
        <>
            <div className="stars" onClick={async (e) => {
             setModalOpen(true);
               
            }}>

                <Rating
                    readonly={true}
                    size={15}
                    initialValue={rating}
                    transition={true}
                    allowFraction={true}

                />
            </div>
            <div className="ratings" >
                <p>
                    {rating} <span>({totalRatings} Ratings)</span>
                </p>
            </div>
            {(modalOpen) &&
          
                  <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                    <div className="relative w-auto my-6 mx-auto max-w-3xl">
                      <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                        <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t ">
                          <h3 className="text-3xl font=semibold"> {rateAlready == true ? "Thanks For your Rating!!!" : `Rate ${store.title}`}</h3>
                          <button
                            className="bg-transparent border-0 text-black float-right"
                            onClick={() => { setModalOpen(false); (rateAlready !== true && setUserRating(0)) }}
                          >
                            <span className="text-black opacity-7 h-6 w-6 text-xl block bg-gray-400 py-0 rounded-full">
                              x
                            </span>
                          </button>
                        </div>
                        <div className="relative p-6 flex-auto">
                        <Rating
                        readonly={(rateAlready == true ? true : false)}
                        onClick={handleRating}
                        initialValue={userRating}
                        transition={true}
                        allowFraction={false}

                    />
                    <div className="storeBtn">
                        {rateAlready !== true &&
                            <a href="#" onClick={() => handleSubmit()}>Submit</a>
                        }
                        <a href="#" data-bs-dismiss="modal"
                            aria-label="Close"
                            onClick={() => { setModalOpen(false); (rateAlready !== true && setUserRating(0)) }}> Cancel</a>
                    </div>
                        </div>
                       
                      </div>
                    </div>
                  </div>
               
             
            }
        </>
    )

}
