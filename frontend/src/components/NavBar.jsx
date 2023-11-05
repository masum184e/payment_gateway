import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <nav className="bg-green-500 py-3">
      <div className="flex justify-between items-center max-w-screen-xl mx-auto">
        <div>
          <h2 className="font-bold text-4xl text-white">Payment Gateway</h2>
        </div>
        <ul className="flex gap-4 items-center">
          <li className="underline text-xl text-white font-semibold"><Link to="/stripe-checkout">Stripe Checkout</Link></li>
          <li className="underline text-xl text-white font-semibold"><Link to="/sslcomerz">SSLCOMERZ</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;