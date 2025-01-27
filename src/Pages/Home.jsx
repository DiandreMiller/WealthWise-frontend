import PropTypes from 'prop-types';
import HomeComponent from "../Components/HomeComponent";

const Home = ({ darkMode }) => {

    return (
        <div>
            <HomeComponent darkMode={darkMode} />
        </div>
    );

}

Home.propTypes = {
    darkMode: PropTypes.func.isRequired
  }

export default Home;