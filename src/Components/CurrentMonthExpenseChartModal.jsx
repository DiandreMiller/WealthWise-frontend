import PropTypes from 'prop-types';
import { PieChart, Pie, Cell, Sector } from 'recharts';
import { useState } from 'react';
import expenses from '../assets/expenses.png';

const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF',
    '#FF4560', '#4CAF50', '#F9A825', '#795548', '#673AB7',
    '#2196F3', '#F44336', '#00BCD4', '#8BC34A', '#E91E63',
    '#3F51B5', '#CDDC39', '#607D8B', '#FFC107', '#9C27B0',
    '#76FF03', '#03A9F4', '#FF5722',
];

const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';
    return (
        <g>
            <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
                {payload.name}
            </text>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius + 10}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
            />
            <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
            <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`$${value}`}</text>
        </g>
    );
};

const CurrentMonthExpenseChartModal = ({
    currentMonth,
    currentMonthExpenses,
    filteredExpense,
    getPreviousMonth,
    spendingComparedToLastMonth,
    isSpendingMore,
    darkMode,
}) => {
    const [activeIndex, setActiveIndex] = useState(null);

    // Categories for expense chart
    const categories = () => {
        const userCategories = filteredExpense.map(input => input.category_type);
        const userExpenses = filteredExpense.map(input => parseFloat(input.amount));
        const categoriesMap = new Map();

        userCategories.forEach((category, index) => {
            if (!categoriesMap.has(category)) categoriesMap.set(category, []);
            categoriesMap.get(category).push(index);
        });

        return Array.from(categoriesMap.entries()).map(([name, indices]) => ({
            name,
            value: indices.reduce((sum, index) => sum + userExpenses[index], 0),
        }));
    };

    const chartData = categories();

    if (currentMonthExpenses === 0) {
        return (
            <div>
                <h3 className="text-2xl font-semibold text-gray-700">
                    Uh oh, it seems you haven't added any expenses yet. Add some expenses to see your spending chart.
                </h3>
                <img className="h-3/6 mt-4" src={expenses} alt="expenses" />
            </div>
        );
    }

    return (
        <div>
            <div>
                <h3 className="text-2xl font-semibold text-gray-700">
                    Here is a breakdown of your {currentMonth} expenses
                </h3>
            </div>
            <div className="flex justify-center items-center h-full">
                <PieChart className="justify-items-center" width={400} height={400}>
                    <Pie
                        data={chartData}
                        cx={200}
                        cy={200}
                        innerRadius={100}
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="value"
                        activeIndex={activeIndex}
                        activeShape={renderActiveShape}
                        onMouseEnter={(_, index) => setActiveIndex(index)}
                        onMouseLeave={() => setActiveIndex(null)}>
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                </PieChart>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-gray-700">
                    You've Spent ${currentMonthExpenses.toFixed(2)} so far in {currentMonth}
                </h3>
                <p className="text-xs text-gray-700 mt-4 flex items-center justify-center">
                    You are spending{' '}
                    <span
                        className={`ml-2 font-bold ${
                            isSpendingMore ? 'text-red-500' : 'text-green-500'}`}>
                        {isSpendingMore ? '▲' : '▼'} {spendingComparedToLastMonth}%&nbsp;
                    </span>
                    {isSpendingMore ? 'more' : 'less'} in {currentMonth} compared to {getPreviousMonth}.
                </p>
            </div>
        </div>
    );
};

CurrentMonthExpenseChartModal.propTypes = {
    currentMonth: PropTypes.string.isRequired,
    currentMonthExpenses: PropTypes.number.isRequired,
    filteredExpense: PropTypes.arrayOf(
        PropTypes.shape({
            category_type: PropTypes.string.isRequired,
            amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        })
    ).isRequired,
    getPreviousMonth: PropTypes.string.isRequired,
    previousMonthExpenses: PropTypes.number.isRequired,
    spendingComparedToLastMonth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    isSpendingMore: PropTypes.bool,
    darkMode: PropTypes.func.isRequired,
};

export default CurrentMonthExpenseChartModal;
