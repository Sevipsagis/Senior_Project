#include <EEPROM.h>

//struct defaultData {
//  String d_roomID = "101";
//  float d_elec = 0;
//  float d_water = 0;
//} defaultData;

struct backupData {
  String b_roomID;
  float b_elec;
  float b_water;
} backupData;

String roomID = "";
float elec = 0.00;
float water = 0.00;

void setup() {
  Serial.begin(9600);
  EEPROM.begin(512);
  EEPROM.get(0, backupData);
}

void loop() {
  roomID = backupData.b_roomID;
  elec = backupData.b_elec;
  water = backupData.b_water;
  Serial.println(roomID);
  Serial.println(elec);
  Serial.println(water);
  backupData.b_roomID = "101";
  backupData.b_elec += 0.3;
  backupData.b_water += 0.7;
  EEPROM.put(0, backupData);
  EEPROM.commit();
  delay(2500);
}
