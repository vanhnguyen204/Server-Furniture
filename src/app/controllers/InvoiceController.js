import InvoiceDetail from "../models/InvoiceDetail.js";
import Invoice from "../models/Invoice.js";
import Cart from "../models/Cart.js";
import Product from '../models/Product.js'
import { formatDate } from "../../utils/formatDate.js";
import moment from 'moment';
class InvoiceController {
    async createInvoice(req, res, next) {
        console.log('Creating invoice.')
        try {
            const { _id } = req.body.user;
            const { totalPrice, data, paymentType,
                shippingAddress, delivery } = req.body;

            const now = new Date();
            const timeNowFormatted = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

            const newInvoice = new Invoice({
                userId: _id,
                totalPrice: totalPrice,
                dateExport: timeNowFormatted,
                paymentType,
                shippingAddress,
                delivery
            })
            const response = await newInvoice.save();
            for (let index = 0; index < data.length; index++) {
                const newInvoiceDetail = new InvoiceDetail({
                    productId: data[index].productId,
                    price: data[index].price,
                    quantity: data[index].quantity,
                    invoiceId: response._id
                })
                newInvoiceDetail.save();
            }
            await Cart.deleteMany({ userId: _id })
            console.log('Create invoice success.')
            res.status(201).json({ message: 'Create invoice success!', status: 201 })
        } catch (error) {
            next(error)
        }
    }
    async createInvoiceAndroid(req, res, next) {
        console.log('Creating invoice.')
        try {
            const { _id } = req.body.user;
            const { totalPrice, data, paymentType,
                shippingAddress, delivery } = req.body;

            const now = new Date();
            const timeNowFormatted = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
            const newInvoice = new Invoice({
                userId: _id,
                totalPrice: totalPrice,
                dateExport: timeNowFormatted,
                paymentType,
                shippingAddress,
                delivery
            })
            const response = await newInvoice.save();
            for (let index = 0; index < data.length; index++) {
                console.log(data[index]._id)
                const newInvoiceDetail = new InvoiceDetail({
                    productId: data[index]._id,
                    price: data[index].price,
                    quantity: data[index].quantity,
                    invoiceId: response._id
                })
                newInvoiceDetail.save();
            }
            await Cart.deleteMany({ userId: _id })
            console.log('Create invoice success.')
            res.status(201).json({ message: 'Create invoice success!', status: 201 })
        } catch (error) {
            next(error)
        }
    }
    async getMyInvoice(req, res, next) {
        try {
            const { _id } = req.body.user
            const response = await Invoice.find({ userId: _id })
            const filter = response.map((item) => {
                item.createdAt = formatDate(item.createdAt)
                return item
            })
            res.status(200).json(filter)
        } catch (error) {
            next(error)
        }
    }

    async getInvoiceDetail(req, res, next) {
        console.log('Get invoice details')
        try {
            const { invoiceId } = req.params;
            const response = await InvoiceDetail.find({ invoiceId });
            const filterProductId = response.map(item => {
                return item.productId;
            });

            const products = await Product.find({ _id: { $in: filterProductId } });


            const asignQuantities = products.map((item, index) => {
                for (let i = 0; i < response.length; i++) {

                    if (item._id.toString() === response[i].productId) {
                        item.quantity = response[i].quantity
                        const newItem = { ...item._doc, quantity: response[i].quantity }

                        return newItem
                    }
                }
            })

            return res.status(200).json(asignQuantities);
        } catch (error) {
            next(error)
        }
    }
    async statistical(req, res, next) {
        console.log('Get statistical');
        const { time } = req.params;
        const { _id } = req.body.user;

        if (!time) {
            return res.status(400).json({ error: 'Time parameter is required' });
        }

        console.log(`Time received: ${time}`);
        console.log(`User ID: ${_id}`);

        try {
            // Chuyển đổi thời gian truyền vào sang đối tượng Date
            const targetDate = moment(time, 'YYYY-MM-DD HH:mm:ss');
            const targetDayStart = targetDate.startOf('day').format('YYYY-MM-DD HH:mm:ss');
            const targetDayEnd = targetDate.endOf('day').format('YYYY-MM-DD HH:mm:ss');

            console.log(`Target Day Start: ${targetDayStart}, Target Day End: ${targetDayEnd}`);

            const dailyInvoices = await Invoice.find({
                dateExport: {
                    $gte: targetDayStart,
                    $lt: targetDayEnd
                },
                userId: _id
            });
            console.log(dailyInvoices)
            const startOfWeek = targetDate.startOf('isoWeek').format('YYYY-MM-DD HH:mm:ss');
            const endOfWeek = targetDate.endOf('isoWeek').format('YYYY-MM-DD HH:mm:ss');
            console.log(`Start of Week: ${startOfWeek}, End of Week: ${endOfWeek}`);

            const weeklyInvoices = await Invoice.find({
                dateExport: {
                    $gte: startOfWeek,
                    $lt: endOfWeek
                },
                userId: _id
            });

            const startOfMonth = targetDate.startOf('month').format('YYYY-MM-DD HH:mm:ss');
            const endOfMonth = targetDate.endOf('month').format('YYYY-MM-DD HH:mm:ss');
            console.log(`Start of Month: ${startOfMonth}, End of Month: ${endOfMonth}`);

            const monthlyInvoices = await Invoice.find({
                dateExport: {
                    $gte: startOfMonth,
                    $lt: endOfMonth
                },
                userId: _id
            });

            console.log('Get statistical success!');

            const filterDailyInvoiceId = dailyInvoices.map(item => {
                return item._id.toString();
            })
            const filterWeeklyInvoiceId = weeklyInvoices.map(item => {
                return item._id.toString();
            })
            const filterMonthlyInvoiceId = monthlyInvoices.map(item => {
                return item._id.toString();
            })
            // get product id for daily, month, year
            const invoiceDetailDaily = await InvoiceDetail.find({ invoiceId: { $in: filterDailyInvoiceId } })

            const filterProductIdDaily = invoiceDetailDaily.map(item => {
                return item.productId;
            })
            const invoiceDetailMonthly = await InvoiceDetail.find({ invoiceId: { $in: filterMonthlyInvoiceId } })
            const filterProductIdMonthly = invoiceDetailMonthly.map(item => {
                return item.productId;
            })
            const invoiceDetailWeekly = await InvoiceDetail.find({ invoiceId: { $in: filterWeeklyInvoiceId } })
            const filterProductIdWeekly = invoiceDetailWeekly.map(item => {
                return item.productId;
            })

            const productsDaily = await Product.find({ _id: { $in: filterProductIdDaily } })
            const productsWeekly = await Product.find({ _id: { $in: filterProductIdWeekly } })
            const productsMonthly = await Product.find({ _id: { $in: filterProductIdMonthly } })


            const assignProductsDaily = productsDaily.map((item, index) => {
                const foundInvoiceDetail = invoiceDetailDaily.find(detail => detail.productId === item._id.toString());

                if (foundInvoiceDetail) {
                    return {
                        ...item._doc,
                        quantity: foundInvoiceDetail.quantity
                    };
                } else {
                    return {
                        ...item._doc,
                        quantity: 0
                    };
                }
            })
            const assignProductsWeekly = productsWeekly.map((item, index) => {
                const foundInvoiceDetail = invoiceDetailWeekly.find(detail => detail.productId === item._id.toString());

                if (foundInvoiceDetail) {
                    return {
                        ...item._doc,
                        quantity: foundInvoiceDetail.quantity
                    };
                } else {
                    return {
                        ...item._doc,
                        quantity: 0
                    };
                }
            })
            const assignProductsMonthly = productsMonthly.map((item, index) => {
                const foundInvoiceDetail = invoiceDetailMonthly.find(detail => detail.productId === item._id.toString());

                if (foundInvoiceDetail) {
                    return {
                        ...item._doc,
                        quantity: foundInvoiceDetail.quantity
                    };
                } else {
                    return {
                        ...item._doc,
                        quantity: 0
                    };
                }
            })


            console.log('Get product daily')
            console.log(assignProductsDaily);
            // sum daily
            let sumDaily = 0
            for (let i = 0; i < dailyInvoices.length; i++) {
                sumDaily += dailyInvoices[i].totalPrice
            }

            // sum monthly
            let sumMonthly = 0
            for (let i = 0; i < monthlyInvoices.length; i++) {
                sumMonthly += monthlyInvoices[i].totalPrice
            }
            // sum weekly
            let sumWeekly = 0
            for (let i = 0; i < weeklyInvoices.length; i++) {
                sumWeekly += weeklyInvoices[i].totalPrice
            }

            console.log(sumMonthly, sumDaily)


            res.status(200).json({
                daily: { totalPrice: sumDaily, products: assignProductsDaily },
                weekly: { totalPrice: sumWeekly, products: assignProductsWeekly },
                monthly: { totalPrice: sumMonthly, products: assignProductsMonthly },
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error.message });
        }
    }


}

function getISOWeekNumber(date) {
    const tempDate = new Date(date.getTime());
    tempDate.setHours(0, 0, 0, 0);
    tempDate.setDate(tempDate.getDate() + 3 - (tempDate.getDay() + 6) % 7);
    const firstThursday = tempDate.getTime();
    tempDate.setMonth(0, 1);
    if (tempDate.getDay() !== 4) {
        tempDate.setMonth(0, 1 + ((4 - tempDate.getDay()) + 7) % 7);
    }
    const weekNumber = 1 + Math.round((firstThursday - tempDate) / 604800000);
    return weekNumber;
}
export default new InvoiceController();