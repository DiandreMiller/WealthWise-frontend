import PropTypes from "prop-types";
import DashboardComponent from "../Components/DashboardComponents/DashboardComponent"

const Dashboard = ({ darkMode }) => {

    return (
        <div>
            <DashboardComponent darkMode={darkMode} />
        </div>
    )
}

Dashboard.propTypes = {
    darkMode: PropTypes.func.isRequired,
}

export default Dashboard;