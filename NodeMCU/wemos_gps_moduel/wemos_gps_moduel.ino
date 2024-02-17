#include <TinyGPS++.h>
#include <SoftwareSerial.h>
#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <ESP8266HTTPClient.h>


TinyGPSPlus gps;
static const int RXPin = D6, TXPin = D5;
SoftwareSerial SerialGPS(RXPin, TXPin); 

const char* ssid = "REDMI";
const char* password = "english123";

float Latitude , Longitude;
int year , month , date, hour , minute , second;
String DateString , TimeString , LatitudeString , LongitudeString;


WiFiServer server(80);
void setup()
{
  Serial.begin(9600);
  SerialGPS.begin(9600);
  Serial.println();
  Serial.print("Connecting");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");

  server.begin();
  Serial.println("Server started");
  Serial.println(WiFi.localIP());
}

void loop()
{
  while (SerialGPS.available() > 0)
    if (gps.encode(SerialGPS.read()))
    {
      if (gps.location.isValid())
      {
        Latitude = gps.location.lat();
        LatitudeString = String(Latitude , 6);
        Longitude = gps.location.lng();
        LongitudeString = String(Longitude , 6);
      }
       if (gps.time.isValid())
      {
        TimeString = "";
        hour = gps.time.hour()+ 5; //adjust UTC
        minute = gps.time.minute()+30;
        second = gps.time.second();
    
        if (hour < 10)
        TimeString = '0';
        TimeString += String(hour);
        TimeString += " : ";

        if (minute < 10)
        TimeString += '0';
        TimeString += String(minute);
        TimeString += " : ";

        if (second < 10)
        TimeString += '0';
        TimeString += String(second);
      }
    }
  WiFiClient client = server.available();
  if (!client)
  {
    return;
  }
 String s="";
  //Response
  s= "HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n\r\n <!DOCTYPE html> <html> <head> <title>NEO-6M GPS Readings</title> <style>";
  s += "table, th, td {border: 1px solid blue;} </style> </head> <body> <h1  style=";
  s += "font-size:300%;";
  s += " ALIGN=CENTER>NEO-6M GPS Readings</h1>";
  s += "<p ALIGN=CENTER style=""font-size:150%;""";
  s += "> <b>Location Details</b></p> <table ALIGN=CENTER style=";
  s += "width:50%";
  s += "> <tr> <th>Latitude</th>";
  s += "<td ALIGN=CENTER >";
  s += LatitudeString;
  s += "</td> </tr> <tr> <th>Longitude</th> <td ALIGN=CENTER >";
  s += LongitudeString;
  s += "</td> </tr> <tr> <th>Time</th> <td ALIGN=CENTER >";
  s += TimeString;
  s += "</td> </tr> </table>";
  
 
  
 
s+="<script>";
              s+="var xhr = new XMLHttpRequest();";
               s+="var url = 'https://d89c-202-140-46-74.ngrok-free.app/addgpsdata';";
                s+="xhr.open('POST', url, true);";
                s+="xhr.setRequestHeader('Content-Type', 'application/json');";
                s+="xhr.onreadystatechange = function () {";
                s+="if (xhr.readyState === 4 && xhr.status === 200) {";
                s+="var json = JSON.parse(xhr.responseText);";
                s+="console.log('Hello', json);";
                s+="}";
                s+="};";
                s+="var data = JSON.stringify({'latitude':";
                s+=LatitudeString;
                s+=",'longitude':";
                s+=LongitudeString;
                //  s+=",'time':";
                //  s+=TimeString;
                s+="});";
                s+="xhr.send(data);";
                 Serial.print(TimeString);
                s+="location.reload();";
                            
         s+="</script>";
  s += "</body> </html> \n";

        
  client.print(s);
 

  delay(100);
}