import PropTypes from 'prop-types';
import ContactComponent from "../Components/ContactComponent";

const Contact = ({ darkMode }) => {
    
        return (
            <div>
                <ContactComponent darkMode={darkMode} />
            </div>
        );
    
    }

    
Contact.propTypes = {
    darkMode: PropTypes.func.isRequired
 }

export default Contact;