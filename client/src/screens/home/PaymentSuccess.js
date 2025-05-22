import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { emptyCart } from '../../store/reducers/cartReducer';
import { BsCheck2Circle } from 'react-icons/bs';
import Nav from '../../components/home/Nav';
import Footer from '../../components/home/Footer';

const PaymentSuccess = () => {
  const dispatch = useDispatch();

  // Clear the cart on successful payment
  useEffect(() => {
    dispatch(emptyCart());
  }, [dispatch]);

  return (
    <>
      <Nav />
      <div className="container mt-5 mb-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow">
              <div className="card-body text-center p-5">
                <BsCheck2Circle className="text-success" size={80} />
                <h2 className="mt-4 mb-3">Payment Successful!</h2>
                <p className="lead mb-4">
                  Thank you for your purchase. Your order has been successfully processed.
                </p>
                <div className="d-flex justify-content-center gap-3 mt-4">
                  <Link to="/orders" className="btn btn-primary">
                    View My Orders
                  </Link>
                  <Link to="/" className="btn btn-outline-secondary">
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PaymentSuccess;

