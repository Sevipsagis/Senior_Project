double sensorValue = 0;
double sensorValue1 = 0;
int crosscount = 0;
int climbhill = 0;
double VmaxD = 0;
double VeffD;
double Veff;
void setup() {
  Serial.begin(115200);
}
void loop() {
  sensorValue1 = sensorValue;
  delay(100);
  sensorValue = analogRead(A0);
  Serial.println(sensorValue);
  VmaxD = sensorValue1;
  VeffD = VmaxD / sqrt(2);
  Veff = (((VeffD - 420.76) / -90.24) * -210.2) + 210.2;
  Serial.println(Veff);
  if (sensorValue > sensorValue1 && sensorValue > 511) {
    climbhill = 1;
    VmaxD = sensorValue;
  }
  if (sensorValue < sensorValue1 && climbhill == 1) {
    climbhill = 0;
    VmaxD = sensorValue1;
    VeffD = VmaxD / sqrt(2);
    Veff = (((VeffD - 420.76) / -90.24) * -210.2) + 210.2;
    Serial.println(Veff);
    VmaxD = 0;
  }
}
