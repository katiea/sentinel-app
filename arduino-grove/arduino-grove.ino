#include <SoftwareSerial.h>
#include <Wire.h>


const int pinButton = 3;
const int alertOut = 2;
const int alertInd = 7;
int x = 0;

SoftwareSerial mySerial(10,11) // pins for rx,tx
void setup()
{
    Serial.begin(57600);
    pinMode(pinButton, INPUT);
    pinMode(alertOut, OUTPUT);
    pinMode(alertInd, OUTPUT);

    Wire.begin(); 
}

void loop()
{
    if(digitalRead(pinButton))
    {
        digitalWrite(alertOut, HIGH);
        digitalWrite(alertInd, HIGH);
        Wire.beginTransmission(9); 
        Wire.write(x);               
        Wire.endTransmission();   
        x++; // Increment x
        if (x > 5) {
          x = 0; 
        }
    }
    else
    {
        // Otherwise, turn the LED off.
        digitalWrite(alertOut, LOW);
        digitalWrite(alertInd, LOW);
    }
    
    delay(10);
}

