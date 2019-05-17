int relay = 5;
int num = 0;
int switchPin = 4;
byte button;
byte oldbutton = 0;
byte state = 0;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  pinMode(relay, OUTPUT);
  pinMode(switchPin, INPUT);
}

void loop() {
  // put your main code here, to run repeatedly:
  button = digitalRead(switchPin);
  if (button && !oldbutton) // same as if(button == high && oldbutton == low)
  {
    //we have a new button press
    if (state == 0) // if the state is off, turn it on
    {
      digitalWrite (relay, HIGH);
      state = 1;
    }
    else // if the state is on, turn it off
    {
      digitalWrite (relay, LOW);
      state = 0;
    }
    oldbutton = 1;
  }
  else if (!button && oldbutton) // same as if(button == low && oldbutton == high)
  {
    // the button was released
    oldbutton = 0;
  }
}
//if (buttonState % 2 == 0) {
//  digitalWrite (relay, HIGH);
//} else if (buttonState % 2 == 1) {
//  digitalWrite (relay, LOW);
//}
//Serial.println(buttonState);
//  digitalWrite (relay, HIGH);
//  Serial.println(num);
//  num += 1;
//  delay(10000);
//  digitalWrite (relay, LOW);
//  delay(10000);
