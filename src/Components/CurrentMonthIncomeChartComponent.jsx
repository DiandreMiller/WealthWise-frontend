import PropTypes from 'prop-types';
import { PieChart, Pie, Cell } from 'recharts';


const COLORS = [
    '#0088FE', // Blue
    '#00C49F', // Green
    '#FFBB28', // Yellow
    '#FF8042', // Orange
    '#AF19FF', // Purple
    '#FF4560', // Red
    '#4CAF50', // Emerald Green
    '#F9A825', // Gold
    '#795548', // Brown
    '#673AB7', // Deep Purple
    '#2196F3', // Light Blue
    '#F44336', // Coral
    '#00BCD4', // Cyan
    '#8BC34A', // Lime Green
    '#E91E63', // Pink
    '#3F51B5', // Indigo
    '#CDDC39', // Chartreuse
    '#607D8B', // Slate Gray
  ];
  

const CurrentMonthChartIncomeComponent = ({ currentMonth, currentMonthIncome, showAllIncome, userData, filteredIncome }) => {


    const categories = () => {
        const userCategories = filteredIncome.map((input) => input.category);
        const userIncomes = filteredIncome.map((input) => parseFloat(input.amount));
        const categoriesMap = new Map();
    
        // Group indices by category
        userCategories.forEach((category, index) => {
            if (!categoriesMap.has(category)) {
                categoriesMap.set(category, []);
            }
            categoriesMap.get(category).push(index);
        });
    
        const categoriesOptions = [
            'salary',
            'rental',
            'investments',
            'business',
            'pension',
            'social security',
            'royalties',
            'government assistance',
            'gifts',
            'bonus',
            'inheritance',
            'lottery/gambling',
            'gigs',
            'asset sales',
            'tax refunds',
            'severance pay',
            'grants/scholarships',
            'other'
        ];
    
        const categoriesOptionsMap = new Map();
    
        categoriesOptions.forEach((category) => {
            categoriesOptionsMap.set(category, 0);
        });
    
        for (let [category, indices] of categoriesMap) {
            let total = indices.reduce((sum, index) => sum + userIncomes[index], 0);
            total = parseFloat(total.toFixed(2));
    
            if (categoriesOptionsMap.has(category)) {
                categoriesOptionsMap.set(category, total);
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
                <h3 className="text-lg font-semibold text-gray-700">Here is a breakdown of you {currentMonth} income</h3>
            </div>
            <PieChart width={400} height={400}>
                <Pie
                    data={chartData}
                    cx={200}
                    cy={200}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                    label
                >
                {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
                </Pie>
            </PieChart>
        </div>
    )
}

export default CurrentMonthChartIncomeComponent;