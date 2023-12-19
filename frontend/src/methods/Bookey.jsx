import { useState, useEffect } from "react";
import { AiOutlineDoubleLeft } from 'react-icons/ai'

const Bookey = () => {
  const [cartData, setCartData] = useState([])
  const [discount, setDiscount] = useState(0);
  const [coupon, setCoupon] = useState("");
  useEffect(() => {
    fetch("/data.json")
      .then(res => res.json())
      .then(data => setCartData(data.items))
  }, [])
  const total = cartData.reduce((acc, current) => acc + current.price * current.quantity, 0);
  const handleSubmit = event => {
    event.preventDefault();
    if (coupon === "FRIDAY") {
      setDiscount(10)
    } else {
      alert("please type `FRIDAY`")
    }
  }
  const handleCheckOut = () => {
    const data = {
      userId: "ASH2125033M",
      name: "Masum Billah",
      number: "123456789",
      address: "Jashore, Bangladesh",
      products: cartData,
      subtotal: total,
      discount: discount,
      total: total - discount
    };

    fetch("http://localhost:4002/payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(data => {
        console.log(data)
        location.replace(data.PayUrl)
      })
  }
  return (
    <div className="flex min-h-screen">
      <div className="w-3/4 p-8">
        <div className="flex justify-between border-b-2 pb-4">
          <h1 className="font-bold text-4xl">Shopping Cart</h1>
          <span className="font-bold text-2xl">{cartData.length} Items</span>
        </div>
        <div>
          <div className="flex justify-between">
            <h3 className="font-bold my-4 text-xl uppercase text-gray-500 flex items-center w-2/5">Product Details</h3>
            <h3 className="font-bold my-4 text-xl uppercase text-gray-500 flex justify-center items-center w-1/5">Quantity</h3>
            <h3 className="font-bold my-4 text-xl uppercase text-gray-500 flex justify-center items-center w-1/5">Price</h3>
            <h3 className="font-bold my-4 text-xl uppercase text-gray-500 flex justify-center items-center w-1/5">Sub Total</h3>
          </div>
          {
            cartData.map((data) => (
              <div className="flex justify-between mb-6" key={data.product_id}>
                <div className="flex w-2/5">
                  <img className="w-48 h-24 rounded" src={data.image} alt={data.product_id} />
                  <div className="px-2">
                    <h3 className="font-bold text-lg">{data.name}</h3>
                    <h4 className="textlg">Product Code: {data.product_id}</h4>
                  </div>
                </div>
                <div className="w-1/5 flex justify-center items-center">{data.quantity}</div>
                <div className="w-1/5 flex justify-center items-center">${data.price}</div>
                <div className="w-1/5 flex justify-center items-center">${data.quantity * data.price}</div>
              </div>
            ))
          }
        </div>
        <a href="#" className="flex items-center gap-2 text-blue-700"><AiOutlineDoubleLeft /> <span>Continue Shopping</span></a>
      </div>
      <div className="w-1/4 bg-[#eeefff] py-8 px-4">
        <h2 className="font-bold text-2xl pb-6 border-b-2 border-gray-400" >Order Summary</h2>
        <div className="pr-8 my-4 space-y-2">
          <div className="flex justify-between">
            <span>Total Items:</span>
            <span className="font-bold">{cartData.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Sub Total:</span>
            <span className="font-bold">${total}</span>
          </div>
          <div className="flex justify-between">
            <span>Discount:</span>
            <span className="font-bold">${discount}</span>
          </div>
          <div className="flex justify-between">
            <span>Total :</span>
            <span className="font-bold">${total - discount}</span>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="flex justify-between pr-8 mt-8">
          <input type="text" className="rounded-l  font-semibold px-3 text-lg border-0 bg-gray-300 py-1 outline-0 w-3/4" name="coupon" id="coupon" value={coupon} onChange={(event) => setCoupon(event.target.value)} placeholder="Type FRIDAY" />
          <button type="submit" className="bg-green-400 w-1/4 inline-block rounded-r font-semibold py-1 text-lg">Apply</button>
        </form>
        <div className="pr-8">
          <button onClick={handleCheckOut} className="bg-green-400 uppercase w-full rounded font-semibold text-lg py-2 mt-8">Checkout</button>
        </div>
      </div>
    </div>
  );
};

export default Bookey;