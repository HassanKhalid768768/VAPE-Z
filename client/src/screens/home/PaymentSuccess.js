import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { emptyCart } from '../../store/reducers/cartReducer';
import { BsCheck2Circle } from 'react-icons/bs';
import Nav from '../../components/home/Nav';
import Footer from '../../components/home/Footer';
import { useVerifyPaymentMutation } from '../../store/services/paymentService';

const PaymentSuccess = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { userToken } = useSelector(state => state.authReducer);
  const [verifyPayment, { isLoading, isError }] = useVerifyPaymentMutation();

  useEffect(() => {
    if (!userToken) {
      navigate('/login');
      return;
    }

    const sessionId = new URLSearchParams(location.search).get('session_id');
    if (sessionId) {
      verifyPayment(sessionId)
        .unwrap()
        .then(() => {
          dispatch(emptyCart());
          localStorage.removeItem('cart'); // Clear cart from localStorage
        })
        .catch((err) => {
          console.error('Payment verification failed:', err);
          navigate('/cart');
        });
    } else {
      navigate('/cart');
    }
  }, [location, verifyPayment, dispatch, navigate, userToken]);

  if (isError) {
    navigate('/cart');
    return null;
  }

  if (isLoading) {
    return (
      <>
        <Nav />
        <div className="mt-[70px] pb-[80px]">
          <div className="flex flex-wrap justify-center">
            <div className="w-full sm:w-10/12 md:w-8/12 lg:w-6/12">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
                  <h3 className="text-xl font-semibold mb-2">Verifying your payment...</h3>
                  <p className="text-gray-600 text-center">Please wait while we confirm your payment and process your order.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Nav />
      <div className="mt-[70px] pb-[80px]">
        <div className="flex flex-wrap justify-center">
          <div className="w-full sm:w-10/12 md:w-8/12 lg:w-6/12">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col items-center">
                <BsCheck2Circle className="text-green-500 text-6xl mb-4" />
                <h2 className="text-2xl font-semibold mb-2">Payment Successful!</h2>
                <p className="text-gray-600 text-center mb-6">
                  Thank you for your purchase. Your order has been successfully processed.
                </p>
                <div className="flex gap-4">
                  <Link to="/orders" className="btn btn-indigo">
                    View My Orders
                  </Link>
                  <Link to="/" className="btn btn-outline">
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

