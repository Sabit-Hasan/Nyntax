import { useLocation } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "./CustomerInvoice.scss";
import { useRef, useState } from "react";

export default function CustomerInvoice() {
    const pdfRef = useRef();
    const location = useLocation();
    const { data } = location.state;
    const [message, setMessage] = useState("");

    const downloadPdf = () => {
        const input = pdfRef.current;
        setMessage("Please wait a moment it may take some time!!")
        html2canvas(input).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4', true);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
            const imgX = (pdfWidth - imgWidth * ratio) / 2;
            const imgY = 30;
            pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
            pdf.save('invoice.pdf');
            setMessage("");
        })
    };

    // Getting Price 
    const calculateAmount = (duration, rates) => {
        const durationParts = duration.split(' ');
        let price = 0;
        let amount = 0;

        durationParts.forEach(part => {
            const numericPart = parseInt(part.replace(/\D/g, ''), 10);
            if (part.includes('w')) {
                const weeks = numericPart;
                console.log(weeks);
                price = rates.weekly;
                if (!isNaN(weeks)) {
                    const weeklyPrice = rates.weekly;
                    const weeklyAmount = weeks * weeklyPrice;
                    amount += weeklyAmount;
                }
            } else if (part.includes('d')) {
                price = rates.daily;
                const days = numericPart;
                if (!isNaN(days)) {
                    const dailyPrice = rates.daily;
                    const dailyAmount = days * dailyPrice;
                    amount += dailyAmount;
                }
            } else if (part.includes('h')) {
                price = rates.hourly;
                const hours = numericPart;
                if (!isNaN(hours)) {
                    const hourlyPrice = rates.hourly;
                    const hourlyAmount = hours * hourlyPrice;
                    amount += hourlyAmount;
                }
            }
        });

        return { price, amount };
    };

    const { price, amount } = calculateAmount(data.duration, data.rates);

    // Additional Charges Count
    const calculateAdditionalCharges = (charge) => {
        let addPrice = 0;

        if (charge.collision) {
            addPrice += 9;
        }
        if (charge.liability) {
            addPrice += 15;
        }
        if (charge.rental) {
            addPrice += 11.5;
        }

        return addPrice;
    }

    const addPrice = calculateAdditionalCharges(data.additionalCharges);




    return (
        <>
            <div className="invoice">
                <div className="invoice-container" ref={pdfRef}>

                    {/* ==========LEFT SECTION========== */}
                    <div className="left-section">
                        <div className="div-row">
                            <img src={logo} alt="logo" />
                            <div>
                                <p>CH Car Place Inc</p>
                                <p>162 Berger st</p>
                                <p>Brooklyn, NY 11213</p>
                                <p>PH#</p>
                            </div>
                        </div>

                        <div className="div-row">
                            <div style={{ maxWidth: "145px", wordWrap: "break-word" }}>
                                <h4>RENTER INFO</h4>
                                <p>{data.customerData.firstName} {data.customerData.firstName}</p>
                                <p>{data.customerData.email}</p>
                                <p>PH: {data.customerData.phone}</p>
                            </div>
                            <div>
                                <p>Monday 9:00 AM-6:00 PM</p>
                                <p>Tuesday 9:00 AM-6:00 PM</p>
                                <p>Wednesday 9:00 AM-6:00 PM</p>
                                <p>Thursday 9:00 AM-6:00 PM</p>
                                <p>Friday 9:00 AM-6:00 PM</p>
                                <p>Saturday 9:00 AM-6:00 PM</p>
                                <p>Sunday 9:00 AM-6:00 PM</p>
                            </div>
                        </div>

                        <div>
                            <h4>ADDITIONAL AUTHORIZED DRIVER(S)</h4>
                            <br />
                            <h4>UNIT DETAILS</h4>
                            <p>Unit: {data.carModel} {data.carType}</p>
                            <p>Make & Model: NISSAN ROGUE BLACK</p>
                            <br />
                            <p>BILL TO:</p>
                            <p>Payment Type: Unpaid</p>
                            <p>AUTH: ${data.totalCost}</p>
                            <br />
                            <p>Referral:</p>
                            <p>
                                NOTICE: Collision Insurance (CDW)- $7 per day
                                Limit liability of damages to ones own vehicle up to
                                $1000 in event of an accident,
                            </p>
                            <p>
                                By waiving this coverage renter agrees to be hold
                                liable for damages up to the entire value of the
                                vehicle.
                            </p>
                        </div>

                        <div>
                            <span>Accept</span>
                            <span>Reject</span>
                        </div>

                        <div>
                            <p>
                                Rental service may be refused anyone when done in the best
                                interest of the renting company or customer - Rates do not
                                include gasoline - Reserves the right to collect deposit
                                covering estimated rental charges.
                            </p>
                        </div>
                    </div>

                    {/* ==========RIGHT SECTION========== */}
                    <div className="right-section">
                        <h3>Reservation</h3>
                        <h3>RA #0121</h3>
                        <h5>REPAIR ORDER:</h5>
                        <h5>CLAIM:</h5>
                        <p>Date/Time Out: {data.pickupTime.toString()}</p>
                        <p>Date/Time In: {data.returnTime.toString()}</p>
                        <div className="table-div">
                            <h4>CHARGE SUMMARY</h4>
                            <table>
                                <tr>
                                    <th></th>
                                    <th>Unit</th>
                                    <th>Price</th>
                                    <th>Amount</th>
                                </tr>
                                <tr>
                                    <td>{data.duration}</td>
                                    <td>1</td>
                                    <td>{price}</td>
                                    <td>{amount}</td>
                                </tr>
                                <tr>
                                    <td>NYS State Tax</td>
                                    <td></td>
                                    <td>11.5%</td>
                                    <td>$0.06</td>
                                </tr>
                                <tr>
                                    <td>EST TOTAL TIME & MILEAGE</td>
                                    <td></td>
                                    <td></td>
                                    <td>${addPrice}</td>
                                </tr>
                                <tr>
                                    <td>Discount</td>
                                    <td></td>
                                    <td></td>
                                    <td>-${data.discount}</td>
                                </tr>
                                <tr>
                                    <td>Damages</td>
                                    <td></td>
                                    <td></td>
                                    <td>$0.00</td>
                                </tr>
                                <tr>
                                    <td>Traffic tickets</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>TOTAL ESTIMATE CHARGES</td>
                                    <td></td>
                                    <td></td>
                                    <td>${data.totalCost}</td>
                                </tr>
                                <tr>
                                    <td>Renter Payments</td>
                                    <td></td>
                                    <td></td>
                                    <td>${data.totalCost}</td>
                                </tr>
                            </table>
                        </div>
                        <div>
                            <p style={{ textAlign: "justify" }}>
                                Your rental agreement offers, for an additional charge, an
                                optional waiver to cover all or a part of your responsibility
                                for damage to or loss of the vehicle. Before deciding whether to
                                purchase the waiver, you may wish to determine whether your own
                                automobile insurance or credit card agreement provides you
                                coverage for rental vehicle damage of loss and determine the
                                amount of the deductible under your own insurance coverage. The
                                purchase of the waiver is not mandatory. The waiver is not
                                insurance. I acknowledge that I have received and read a copy of
                                this.
                            </p>
                        </div>
                        <div className="signature">
                            <p>Renters Signature</p>
                            <p>------------------------------------------</p>
                            <p>Additional Driver 1</p>
                            <p>------------------------------------------</p>
                        </div>
                    </div>
                </div>
                <button className="downloadInvoice" onClick={downloadPdf}>Download Invoice</button>
                {
                    message && (<p>{message}</p>)
                }
            </div>
        </>
    );
}