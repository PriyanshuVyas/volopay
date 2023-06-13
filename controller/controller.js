import Item from "../models/models.js";

// ----------- API 1 ------------------------
export const totalItems = async (req,res) => {
    
    const { start_date, end_date, department } = req.query;

    try {
        const startDate = new Date(start_date);
        const endDate = new Date(end_date);

        const result = await Item.aggregate([
        {
            $match: {
            department: department,
            date: { $gte: startDate, $lte: endDate },
            }
        },
        {
            $group: {
            _id: null,
            totalSeats: { $sum: '$seats' },
            },
        },
        ])
    
        res.status(200).json(result);

    } catch (error) {
            console.log('---Error in API 1---'+error);
            res.status(500).json({ error: 'An error occurred' });
        }
}

//--------------------------- API 2 --------------------------------

export const nTotalItem = async (req,res) => {
    const { item_by, start_date, end_date, n } = req.query;

    try {

        const startDate = new Date(start_date);
        const endDate = new Date(end_date);
      
        let sortKey;
        if (item_by === 'quantity') {
          sortKey = 'seats';
        } else if (item_by === 'price') {
          sortKey = 'amount';
        } else {
          return res.status(400).json({ error: 'Invalid item_by parameter' });
        }
      
        const result = await Item.find({
          date: { $gte: startDate, $lte: endDate },
        })
          .sort(`${sortKey}`)
          .limit(n)
          
        if (result.length > 0) {
            res.json(result[n - 1].software);
        } else {
            res.json('');
        }
    }
  catch (error) {
        console.log('---Error in API 2---'+error);
        res.status(500).json({ error: 'An error occurred' });
    }
}

// ------------------------------------- API 3 ----------------------------------

export const percDeptWise = async (req,res) => {
    const { start_date, end_date } = req.query;

    try {

        const startDate = new Date(start_date);
        const endDate = new Date(end_date);

        const result = await Item.aggregate([
        {
            $match: {
            date: { $gte: startDate, $lte: endDate },
            }
        },
        {
            $group: {
            _id: '$department',
            totalSeats: { $sum: '$seats' },
            }
        },
        {
            $project: {
            _id: 0,
            department: '$_id',
            percentage: {
                $concat: [
                    { $toString: { $multiply: [{ $divide: ['$totalSeats', { $sum: '$totalSeats' }] }, 100] } },
                    '%',
                ],
            }
            }
        }
        ])
    
      const departmentPercentage = {};
      result.forEach((item) => {
        departmentPercentage[item.department] = item.percentage;
      });
      res.status(200).json(departmentPercentage);
    
}catch (error) {
    console.log('---Error in API 3---'+error);
    res.status(500).json({ error: 'An error occurred' });
}}

// ------------------------------------- API 4 ----------------------------------------------

export const monthySales = async (req,res) => {
    
    const { product, year } = req.query;
    try{
        const result = await Item.aggregate([
            {
              $match: {
                software: product,
                date: {
                  $gte: new Date(`${year}-01-01`),
                  $lte: new Date(`${year}-12-31`),
                },
              },
            },
            {
              $group: {
                _id: { $month: '$date' },
                totalAmount: { $sum: '$amount' },
              },
            },
            {
              $sort: {
                _id: 1,
              },
            },
            {
              $project: {
                _id: 0,
                month: '$_id',
                totalAmount: 1,
              },
            },
        ])
        const monthlySales = Array(12).fill(0);
        result.forEach((item) => {
            monthlySales[item.month - 1] = item.totalAmount;
        });
        res.status(200).json(monthlySales);
    } catch (error) {       
        console.log('---Error in API 4---'+error);
        res.status(500).json({ error: 'An error occurred' });
    }
}
