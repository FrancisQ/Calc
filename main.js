    var removedRows = [];
    var rowNum;

/* -----------------JQUERY----------------*/
$(document).ready(function () {
//GLOBAL VARS
    var purchasePrice;
    var downPayment;
    var interestRate = parseInt($('#InterestRateOne').val()) ;
    var interestRateSelected = 1;
    var term;
    var amortization;
    var loan;
    var payment;

    
    var count = 0;

    //CHANGED THE RATE OPTION  
    $('#rateOption1').on('click',function(){
        interestRateSelected = 1;
        $('#rateOption1').css({'background-color': 'cadetblue','border':'solid 3px darkgray'});
        $('#rateOption2').css({'background-color': 'lightgray','border':'solid 3px darkgray'}); 
        Update();
        Calculate();
        
    }); 
    $('#rateOption2').on('click',function(){
        interestRateSelected = 2;
        $('#rateOption2').css({'background-color': 'cadetblue','border':'solid 3px darkgray'});
        $('#rateOption1').css({'background-color': 'lightgray','border':'solid 3px darkgray'});
        Update();
        Calculate();
    });


//UPDATED AN INPUT
    $('input, select').on('change', function (){
      
        Update();
        Calculate();  
    });

    function Update(){ 
        //Assign
        purchasePrice = $('#PurchasePrice').val() || 500000;
        //testing = $('inputP#urchasePrice').attr('placeholder');
        downPayment = $('#DownPayment').val() || 50000;
        if(interestRateSelected == 1)
            interestRate = parseFloat($('#InterestRateOne').val());
        else if (interestRateSelected == 2)
            interestRate = parseFloat($('#InterestRateTwo').val());
        
        term = $('#TermOptions').val();
        amortization = $('#Amortization').val();
        //Calculate
        Calculate();
    }

    //    CALCULATE PRINCIPAL/INTEREST
    function Calculate(){

         // Loan Amount
        loan = purchasePrice - downPayment;
        var premium = CheckPremium();
        loan = loan + premium;

        //Step1 :  numOfMonths
        //ToDO: change to allow different payment types?
        var numOfPayments = amortization * 12;
        //Step 2:  annualPercent   
        var rate = (interestRate / 100) / 12;
        //Step 3: Payment of loan
        payment =  loan * (rate * (Math.pow((1 + rate), numOfPayments))) / (Math.pow((1 + rate), numOfPayments) - 1);
        payment = payment.toFixed(0);

        $('#payment').html("Your monthly payment : $" + payment);    


    }

    //  CALCULATE % DOWN FOR INSURANCE
    function CheckPremium(){

        var premium = 0;
        var premiumRate = 0;
        var percentDown = (downPayment/purchasePrice) * 100;

        if(percentDown < 20){
            if( percentDown >= 0 && percentDown<=9.99)
                premiumRate = 0.04;
            else if(percentDown >= 10 && percentDown<=14.99)
                premiumRate = 0.031;
            else if(percentDown >= 15 && percentDown<=19.99)
                premiumRate = 0.028;
            premium = loan * premiumRate;
            $('#premium').html("Insurance Premium : $" + premium + "  ("+ premiumRate*100 + "%)");
        }else{
            $('#premium').html("");
        }
        return premium;
    }

    //    LIABILITIES ADD BUTTON
    $('#addLiabilitiesBtn').click(function (){
        count++;
        var type = '<div class="input-group"><div class="input-group-addon ">$</div><input class="col-xs-12" type="text" id="type'+ count +'" placeholder="Car, Credit Cards..."></div>';
        var balance = '<div class="input-group "><div class="input-group-addon">$</div><input class="col-xs-12" type="number" id="balance'+ count +'" placeholder="1200"></div>';
        var monthly = '<div class="input-group "><div class="input-group-addon">$</div><input class="col-xs-12" type="number" id="monthly'+ count +'" placeholder="50"><div class="input-group-addon">/Month</div></div>';
        var remove = '<button id="removeBtn" type="button" class="removeBtn glyphicon glyphicon-remove btn" value="'+count+'" ></button>';
        var string = '<tr id="row'+count+'"><td class="col-xs-4">'+type+'</td><td class="col-xs-3">'+balance+'</td><td class="col-xs-4">'+monthly+'</td ><td class="col-xs-1">'+remove+'</td></tr>'

        $('table tbody').append(string);
    });

    //    CALCULATE GDS/TDS
     $('#getRatioBtn').click(function (){

         var debt = totalDebt();
    //       EXPENSES
         var heat = $('#Heating').val() || $('#Heating').attr('placeholder');
         var tax =  $('#PropertyTax').val() || $('#PropertyTax').attr('placeholder');
         var condoFee = $('#CondoFee').val() || $('#CondoFee').attr('placeholder');
         var income = $('#Income').val() || $('#Income').attr('placeholder');

         var pith = parseInt(payment) + parseInt(tax) + parseInt(heat);
         var halfCondo = 0.5 * condoFee;
         var gds = ((pith + halfCondo) / income)*100;
         var tds = ((pith + halfCondo + parseInt(debt)) / income) *100;

         var string = '<div id="ratios" class="section text-center container"><div class="result section container col-lg-8 col-lg-offset-2">';
         string += '<h1 id="GDS">Gross Debt Service Ratio: ' + gds.toFixed(0) +'%</h1>';
         string += '</div><div class="result section container col-lg-8 col-lg-offset-2">';
         string += '<h1 id="TDS">Total Debt Service Ratio: ' + tds.toFixed(0) + '%</h1></div></div>';

        $('#ratios').replaceWith(string);
     });

    function totalDebt(){
        var sum = 0;
        var j = 0;
        var numOfRemoved = removedRows.length
        for(var i = 1; i<= count; i++){
            if(numOfRemoved>0){
                console.log("numRemoved >0 == true")
                if (removedRows[j] == i){
                    if(j < removedRows.length-1){
                        j++;
                    }
                }else{
                    sum += parseInt($('#monthly'+i).val()) || 50;
                }
            }else{
                sum += parseInt($('#monthly'+i).val()) || 50;
            }   
        }
        return sum;
    }
});

//MODIFY DYNAMICALLY ADDED ITEMS
$(document).on('click', '.removeBtn', function(){
    rowNum = $(this).val();
    $('#row'+rowNum).remove();
    removedRows.push(rowNum);
    removedRows.sort();
});