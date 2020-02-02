#include <LiquidCrystal_I2C.h>
#include <Wire.h>

volatile int NbTopsFan;

double Calc;
double total = 0;
double one_unit = 0;
LiquidCrystal_I2C lcd(0x27, 16, 2);

int hallsensor = 14;

void rpm () {
  NbTopsFan++;
}

void setup() {
  pinMode(hallsensor, INPUT);
  Serial.begin(9600);
  attachInterrupt(14, rpm, RISING);
  Wire.begin(D2, D1);
  lcd.begin();
  lcd.home();
  lcd.print("Electric: ");
  lcd.setCursor(0, 1);
  lcd.print("Water: ");
  lcd.setCursor(0, 0);

}

void loop () {
  NbTopsFan = 0;
  sei();
  delay (1000);
  cli();
  Calc = ((NbTopsFan * 60 / 7.5) / 3600);
  //  one_unit = one_unit + Calc;
  Serial.print (Calc, 4);
  Serial.print (" L/sec\r\n");
  //  if (one_unit >= 1) {
  total = total + Calc;
  //    one_unit = 0;
  lcd.setCursor(7, 1);
  lcd.print(total, 4);
  //  }
  Serial.print (total, 4);
  Serial.print (" Units\r\n");
  Serial.print (" ------------------------------------------------------\r\n");
}
