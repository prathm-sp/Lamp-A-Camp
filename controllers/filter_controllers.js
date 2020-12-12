
const Camp = require("../models/camps");

exports.filter_by_price = async (req, res) => {
    try {
        const camps = await Camp.find({
            $or: [{
                    "accomodations.Tree House.pricePerNight": {
                        "$lte": req.body.lessThan,
                        "$gte": req.body.greaterThan
                    }
                },
                {
                    "accomodations.Dorm.pricePerNight": {
                        "$lte": req.body.lessThan,
                        "$gte": req.body.greaterThan
                    }
                },
                {
                    "accomodations.Farm Cottage.pricePerNight": {
                        "$lte": req.body.lessThan,
                        "$gte": req.body.greaterThan
                    }
                },
                {
                    "accomodations.Mud House.pricePerNight": {
                        "$lte": req.body.lessThan,
                        "$gte": req.body.greaterThan
                    }
                },
                {
                    "accomodations.Villas.pricePerNight": {
                        "$lte": req.body.lessThan,
                        "$gte": req.body.greaterThan
                    }
                },
                {
                    "accomodations.Tent.pricePerNight": {
                        "$lte": req.body.lessThan,
                        "$gte": req.body.greaterThan
                    }
                },
                {
                    "accomodations.Park N Camp.pricePerNight": {
                        "$lte": req.body.lessThan,
                        "$gte": req.body.greaterThan
                    }
                },
            ]
        })
        if (camps.length < 1) {
            throw new Error("Not Found")
        }
        console.log(camps)
        res.send(camps);
    } catch (error) {
        if (error.message == "Not Found") {
            res.status(404).send("No Camps With Given Price Range Found");
        } else {
            res.status(400).send(error.message)
        }
    }
}

exports.filter_by_activities = async (req, res) => {
    try {
        const activit = req.body.activity;
        if (!activit) {
            throw new Error("Empty")
        }
        const camps = await Camp.find({
            activities: activit
        });
        console.log(camps);
        res.status(200).send(camps)
        // res.send("Done");
    } catch (error) {
        if (error.message == "Empty") {
            res.status(404).send("Select Proper Activity To Sort")
        }
    }
}


exports.filter_by_accommodations = async (req, res) => {
    try {
        if (!req.body.type) {
            throw new Error("Select Type Of Accomodations To Filter")
        }
        switch (req.body.type) {
            case "Tree House":
                const camp_acc1 = await Camp.find({
                    "accomodations.Tree House": {
                        $exists: true
                    }
                });
                if(camp_acc1.length<1)
                {
                    throw new Error("TH")
                }
                res.send(camp_acc1);
                break;
            case "Dorm":
                const camp_acc2 = await Camp.find({
                    "accomodations.Dorm": {
                        $exists: true
                    }
                });
                if(camp_acc2.length<1)
                {
                    throw new Error("D")
                }
                res.send(camp_acc2);
                break;
            case "Farm Cottage":
                const camp_acc3 = await Camp.find({
                    "accomodations.Farm Cottage": {
                        $exists: true
                    }
                });
                if(camp_acc3.length<1)
                {
                    throw new Error("FC")
                }
                res.send(camp_acc3);
                break;
            case "Mud House":
                const camp_acc4 = await Camp.find({
                    "accomodations.Mud House": {
                        $exists: true
                    }
                });
                if(camp_acc4.length<1)
                {
                    throw new Error("MH")
                }
                res.send(camp_acc4);
                break;
            case "Villas":
                const camp_acc5 = await Camp.find({
                    "accomodations.Villas": {
                        $exists: true
                    }
                });
                if(camp_acc5.length<1)
                {
                    throw new Error("V")
                }
                res.send(camp_acc5);
                break;
            case "Tent":
                const camp_acc6 = await Camp.find({
                    "accomodations.Tent": {
                        $exists: true
                    }
                });
                if(camp_acc6.length<1)
                {
                    throw new Error("T")
                }
                res.send(camp_acc6);
                break;
            case "Park N Camp":
                const camp_acc7 = await Camp.find({
                    "accomodations.Park N Camp": {
                        $exists: true
                    }
                });
                if(camp_acc7.length<1)
                {
                    throw new Error("PNC")
                }
                res.send(camp_acc7);
                break;
            default:
                throw new Error("No Accomodations Found")
        }
    } catch (error) {
        if(error.message=="Select Type Of Accomodations To Filter")
        {
            res.status(404).send("Select Type Of Accomodations To Filter")
        }
        else if(error.message=="TH")
        {
            res.status(404).send("No Tree House Accomodations Found")
        }
        else if(error.message=="D")
        {
            res.status(404).send("No Dorm Accomodations Found")
        }
        else if(error.message=="FC")
        {
            res.status(404).send("No Farm Cottages Accomodations Found")
        }
        else if(error.message=="MH")
        {
            res.status(404).send("No Mud House Accomodations Found")
        }
        else if(error.message=="V")
        {
            res.status(404).send("No Villas Accomodations Found")
        }
        else if(error.message=="T")
        {
            res.status(404).send("No Tents Accomodations Found")
        }
        else if(error.message=="PNC")
        {
            res.status(404).send("No Park N Camp Accomodations Found")
        }
        else if(error.message=="No Accomodations Found")
        {
            res.status(404).send("No Accomodations Found");
        }
        else
        {
            res.status(400).send(error.message)
        }
    }
}


exports.filter_by_amenities = async (req, res) => {
    try {
        const animitiy = req.body.type;
        if (!animitiy) {
            throw new Error("Select")
        }
        const camps = await Camp.find({
            animities: animitiy
        });
        if (camps.length < 1) {
            throw new Error("Not")
        }
        res.send(camps);
    } catch (error) {
        if (error.message == "Select") {
            res.status(400).send("Select Proper Amenities")
        } else if (error.message == "Not") {
            res.status(404).send("No Camps With Given Amenities Found");
        } else {
            res.status(404).send(error.message)
        }
    }
}