# coordconv
* Translates coordinate systems to and from each other. The coordinate system has the code below.
* 좌표계를 상호 변환합니다. 좌표계는 아래와 같은 코드를 가지고 있습니다.

| Coord | Code | note |
|----------|----|----|
|TM        | 0| |
|WTM       | 1| |
|CONGNAMUL | 2| |
|WCONGNAMUL| 3|Kakao Map|
|KTM       | 4| |
|WKTM      | 5| |
|UTM       | 6| |
|WGS84     | 7|Google Map, Naver Map|
|BESSEL    | 8| |

# How to Use
```javascript
let kk = coordconv(x, y, from, to)
```

* x : X axis of the coordinate system (ex:longitude)
  - 좌표계의 X축 (예:경도)
* y : Y axis of the coordinate system (ex:latitude)
  - 좌표계의 Y축 (예:위도)
* from : coordinate system code(from)
  - 변환 대상 좌표계 코드
* to : coordinate system code(to)
  -  변환 할 좌표계 코드

* return : transformed coordinates x,y (Array)
  - 변환된 좌표의 x,y (배열)

```javascript
let kk = coordconv(126.9876757,37.5611523,7,3)
// convert WGS84[7] (126.9876757,37.5611523) to WCONGNAMUL[3]
// WGS84 좌표계[7]의 좌표(126.9876757,37.5611523)를 WCONGNAMUL좌표계[3]로 변환한다.

console.log(kk) // [ 497278, 1128228 ]
```

# Example
* Test code that converts WGS84 coordinates to other coordinates and back to WGS84 coordinates
* WGS84 좌표를 다른 좌표로 변환하고, 다시 WGS84 좌표로 변환시키는 테스트코드

```javascript
<script type="text/javascript" src="coordconv.js"></script>
<script>
    const coordNames = ["TM","WTM","CONGNAMUL","WCONGNAMUL","KTM","WKTM","UTM","WGS84","BESSEL"]
    let x = 126.9876757
    let y = 37.5611523

    for ( let k =0 ; k < 9; k++ ) {
        console.log(k)
        let xy = coordconv(x,y,7,k)
        console.log(coordNames[7]+"("+x + "," + y +") => " + coordNames[k] + "(" + xy[0] + "," + xy[1] + ")")
        let cxy = coordconv(xy[0],xy[1],k,7)
        console.log(coordNames[k]+"("+xy[0] + "," + xy[1] +") => " + coordNames[7] + "(" + cxy[0] + "," + cxy[1] + ")")
    }
</script>
```
```
[RESULT]
0
WGS84(126.9876757,37.5611523) => TM(198841.46164981902,450986.185504335)
TM(198841.46164981902,450986.185504335) => WGS84(126.98767573415425,37.561152277544274)
1
WGS84(126.9876757,37.5611523) => WTM(198911.11067044004,451291.3401759742)
WTM(198911.11067044004,451291.3401759742) => WGS84(126.98767576830853,37.56115225508858)
2
WGS84(126.9876757,37.5611523) => CONGNAMUL(497104.15412454755,1127465.9637608374)
CONGNAMUL(497104.15412454755,1127465.9637608374) => WGS84(126.98767799744235,37.56115407978852)
3
WGS84(126.9876757,37.5611523) => WCONGNAMUL(497278,1128228)
WCONGNAMUL(497278,1128228) => WGS84(126.98767677956626,37.56115099221307)
4
WGS84(126.9876757,37.5611523) => KTM(310758.5256985903,551470.6070910962)
KTM(310758.5256985903,551470.6070910962) => WGS84(126.98767573415425,37.561152277544274)
5
WGS84(126.9876757,37.5611523) => WKTM(310565.56662535225,551777.8079165379)
WKTM(310565.56662535225,551777.8079165379) => WGS84(126.98767576830853,37.56115225508856)
6
WGS84(126.9876757,37.5611523) => UTM(322266.19235843327,4159028.8981151287)
UTM(322266.19235843327,4159028.8981151287) => WGS84(126.9876757683075,37.561152255088565)
7
WGS84(126.9876757,37.5611523) => WGS84(126.9876757,37.5611523)
8
WGS84(126.9876757,37.5611523) => BESSEL(126.98977663059763,37.5583554353612)
BESSEL(126.98977663059763,37.5583554353612) => WGS84(126.98767573415425,37.561152277544274)
```

## test code - node.js
```javascript
const coordconv = require('coordconv')
let kk = coordconv(126.9876757,37.5611523,7,3)
console.log(kk)
```

## test code - web browser
```html
<script type="text/javascript" src="coordconv.js"></script>
<script>
    let kk = coordconv(126.9876757,37.5611523,7,3)
    console.log(kk)
</script>
```
