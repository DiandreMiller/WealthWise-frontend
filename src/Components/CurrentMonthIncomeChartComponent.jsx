import PropTypes from 'prop-types';
import { PieChart, Pie, Cell, Sector } from 'recharts';
import { useState } from 'react';

const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF',
    '#FF4560', '#4CAF50', '#F9A825', '#795548', '#673AB7',
    '#2196F3', '#F44336', '#00BCD4', '#8BC34A', '#E91E63',
    '#3F51B5', '#CDDC39', '#607D8B'
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

renderActiveShape.propTypes = {
    cx: PropTypes.number.isRequired,
    cy: PropTypes.number.isRequired,
    midAngle: PropTypes.number.isRequired,
    innerRadius: PropTypes.number.isRequired,
    outerRadius: PropTypes.number.isRequired,
    startAngle: PropTypes.number.isRequired,
    endAngle: PropTypes.number.isRequired,
    fill: PropTypes.string.isRequired,
    payload: PropTypes.shape({
        name: PropTypes.string.isRequired
    }).isRequired,
    value: PropTypes.number.isRequired
};

const CurrentMonthChartIncomeComponent = ({ currentMonth, filteredIncome, currentMonthIncome }) => {
    const [activeIndex, setActiveIndex] = useState(null);

    const categories = () => {
        const userCategories = filteredIncome.map(input => input.category);
        const userIncomes = filteredIncome.map(input => parseFloat(input.amount));
        const categoriesMap = new Map();

        userCategories.forEach((category, index) => {
            if (!categoriesMap.has(category)) categoriesMap.set(category, []);
            categoriesMap.get(category).push(index);
        });

        const categoriesOptions = [
            'salary', 'rental', 'investments', 'business', 'pension',
            'social security', 'royalties', 'government assistance',
            'gifts', 'bonus', 'inheritance', 'lottery/gambling', 'gigs',
            'asset sales', 'tax refunds', 'severance pay', 'grants/scholarships', 'other'
        ];

        const categoriesOptionsMap = new Map(categoriesOptions.map(category => [category, 0]));

        for (let [category, indices] of categoriesMap) {
            const total = indices.reduce((sum, index) => sum + userIncomes[index], 0);
            if (categoriesOptionsMap.has(category)) {
                categoriesOptionsMap.set(category, parseFloat(total.toFixed(2)));
            }
        }

        return Array.from(categoriesOptionsMap.entries())
            .filter(([, value]) => value > 0)
            .map(([name, value]) => ({ name, value }));
    };

    const chartData = categories();

    return (
        <div>
            <div>
                <h3 className="text-2xl font-semibold text-gray-700">
                    Here is a breakdown of your {currentMonth} income
                </h3>
            </div>
            <div className="flex justify-center items-center h-full">
                <PieChart className='justify-items-center' width={400} height={400}>
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
                        onMouseLeave={() => setActiveIndex(null)}
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                </PieChart>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-gray-700">
                    You've Spent ${currentMonthIncome} so far in {currentMonth}
                </h3>
            </div>
        </div>
    );
};

CurrentMonthChartIncomeComponent.propTypes = {
    currentMonth: PropTypes.string.isRequired,
    filteredIncome: PropTypes.arrayOf(PropTypes.shape({
        category: PropTypes.string.isRequired,
        amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
    })).isRequired,
    currentMonthIncome: PropTypes.number.isRequired,
    showAllIncome: PropTypes.bool.isRequired,
    userData: PropTypes.array.isRequired
};

export default CurrentMonthChartIncomeComponent;
