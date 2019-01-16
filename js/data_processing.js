export const MoneyLendingDiscriminator = "moneyLending";
export const ThingLendingDiscriminator = "thingLending";

function compareDateObjects(date1, date2) {
    if ((date1.year  <  date2.year)
     || (date1.year === date2.year && date1.month  <  date2.month)
     || (date1.year === date2.year && date1.month === date2.month && date1.day < date2.day)) {

        return -1;
    }
    else if (date1.year  === date2.year
          && date1.month === date2.month
          && date1.day   === date2.day) {

        return 0;
    }
    
    return 1;
}

export function processUserInfo(serverLendings) {
    let serverLendingsArr = Array.from(serverLendings);
    let processedLendings = new Array();

    serverLendingsArr.forEach(lending => {
        let associable = false;
        let discriminatorValue;

        if (typeof lending.amount !== "undefined") {
            associable = true;

            //l is moneyLending
            discriminatorValue = MoneyLendingDiscriminator;
        } else if ((typeof lending.thing !== "undefined")
                && (typeof lending.emoji !== "undefined")) {
            associable = true;

            //l is thinglending
            discriminatorValue = ThingLendingDiscriminator;
        }

        if (associable) {
            lending["discriminator"] = discriminatorValue;

            let dueDate = new Date(lending.dueDate);
            let locale = "en-US";

            let shortMonthName =
                dueDate
                    .toLocaleDateString(locale, { month: "short" })
                    .substr(0, 3);

            lending["dueDate"] = {
                "day": dueDate.getDate(),
                "month": dueDate.getMonth(),
                "monthName": shortMonthName,
                "year": dueDate.getFullYear()
            };

            processedLendings.push(lending);
        }
    });

    processedLendings.sort((l1, l2) => compareDateObjects(l2.dueDate, l1.dueDate));

    return processedLendings;
};