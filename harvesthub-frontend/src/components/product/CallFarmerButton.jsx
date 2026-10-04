import { FiPhone } from 'react-icons/fi';
import { createInquiry } from '../../api/publicApi.js';
import { getApiErrorMessage } from '../../api/axiosInstance.js';
import Button from '../common/Button.jsx';
import useToast from '../../hooks/useToast.js';

const normalizePhone = (phone = '') => {
  return phone.replace(/[^\d+]/g, '');
};

const CallFarmerButton = ({
  product,
  farmer,
  sticky = false
}) => {
  const { success, error } = useToast();

  const phone =
    farmer?.contactNumber ||
    farmer?.user?.phone ||
    '';

  const handleCall = async () => {
    try {
      await createInquiry({
        product: product._id,
        buyerName: 'Guest buyer',
        buyerPhone: '',
        message: 'Buyer tapped Call Farmer.',
        type: 'call',
        website: ''
      });

      success('Call inquiry recorded.');

      if (phone) {
        window.location.href = `tel:${normalizePhone(phone)}`;
      } else {
        error('This farmer has no contact number listed.');
      }
    } catch (requestError) {
      error(
        getApiErrorMessage(
          requestError,
          'Unable to record your call inquiry'
        )
      );
    }
  };

  if (sticky) {
    return (
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/40 bg-white/85 p-3 shadow-2xl backdrop-blur-xl sm:hidden">
        <Button
          onClick={handleCall}
          className="w-full"
        >
          <FiPhone />
          Call farmer
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={handleCall}
      className="w-full"
    >
      <FiPhone />
      Call farmer
    </Button>
  );
};

export default CallFarmerButton;