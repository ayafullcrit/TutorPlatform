using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TutorPlatform.API.Models.DTOs.Requests.Payment;
using TutorPlatform.API.Services.Interfaces;

namespace TutorPlatform.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PaymentsController : ControllerBase
    {
        private readonly IPaymentService _paymentService;

        public PaymentsController(IPaymentService paymentService)
        {
            _paymentService = paymentService;
        }

        // POST /api/payments/top-up
        [HttpPost("top-up")]
        public async Task<IActionResult> TopUp([FromBody] TopUpRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _paymentService.TopUpAsync(GetCurrentUserId(), request);

            if (!result.Success)
                return BadRequest(result);

            return Ok(result);
        }

        // GET /api/payments/wallet
        [HttpGet("wallet")]
        public async Task<IActionResult> GetWallet()
        {
            var result = await _paymentService.GetWalletAsync(GetCurrentUserId());

            if (!result.Success)
                return BadRequest(result);

            return Ok(result);
        }

        // GET /api/payments/history?page=1&pageSize=20
        [HttpGet("history")]
        public async Task<IActionResult> GetHistory(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20)
        {
            var result = await _paymentService.GetTransactionHistoryAsync(
                GetCurrentUserId(), page, pageSize);

            if (!result.Success)
                return BadRequest(result);

            return Ok(result);
        }

        private int GetCurrentUserId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier);
            return int.Parse(claim!.Value);
        }
    }
}