import PropTypes from 'prop-types';
import AboutComponent from "../Components/AboutComponent";

const About = ({ darkMode }) => {

    return (
        <div>
            <AboutComponent darkMode={darkMode} />
        </div>
    );

}

About.propTypes = {
    darkMode: PropTypes.func.isRequired
  }

export default About;