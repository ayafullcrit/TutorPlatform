namespace TutorPlatform.API.Models.Enums
{
    public enum TransactionType
    {
        TopUp = 1,   // nạp tiền
        BookingPay = 2,   // trừ tiền đặt lịch
        Refund = 3,   // hoàn tiền khi hủy
        Earning = 4,   // tutor nhận tiền khi hoàn thành
        Withdrawal = 5    // rút tiền 
    }
}