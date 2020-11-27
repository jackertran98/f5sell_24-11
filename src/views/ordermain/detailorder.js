import React, { Component } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image, Picker, ScrollView, TextInput, Alert } from 'react-native'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import { sizeFont, sizeHeight, sizeWidth } from '../../utils/helper/size.helper';
import { connect } from 'react-redux';
var numeral = require("numeral");
import { getDetailOrdered } from '../../service/order';
import { listStores, updateOrder } from '../../service/order';
var numeral = require("numeral");
import { handleMoney } from "../../components/money";
import DropDownPicker from 'react-native-dropdown-picker';

class OrderMain extends Component {
    constructor(props) {
        super(props)
        this.state = {
            Data: [],
            List: [],
            loading: false,
            setSelectedValue: '',
            inDateEndPicker: false,
            selectedValue: 'Tất cả',
            startTime: moment()
                .add(-100, "day")
                .format("DD/MM/YYYY"),
            endTime: '',
            city:
                this.props.authUser.CITY == null
                    ? ""
                    : {
                        NAME: this.props.authUser.CITY,
                        MATP: this.props.authUser.CITY_ID,
                    },
            district:
                this.props.authUser.DISTRICT == null
                    ? ""
                    : {
                        NAME: this.props.authUser.DISTRICT,
                        MAQH: this.props.authUser.DISTRICT_ID,
                    },
            districChild:
                this.props.authUser.WARD == null
                    ? ""
                    : {
                        NAME: this.props.authUser.WARD,
                        XAID: this.props.authUser.WARD_ID,
                    },
        }
    }
    showDatePicker2 = () => {
        this.setState({
            inDateEndPicker: true,
        })
    };
    hideDatePicker2 = () => {
        this.setState({
            inDateEndPicker: false,
        })
    };
    handleConfirm2 = (date) => {
        this.setState({
            endTime: moment(date).format("DD/MM/YYYY")
        })

        this.hideDatePicker2();
    };
    handleLoad = async () => {
        const { ID } = this.props.route.params;
        await getDetailOrdered({
            USERNAME: this.props.username,
            CODE_ORDER: ID,
            IDSHOP: this.props.idshop.USER_CODE,
        })
            .then((res) => {
                console.log("this getDetailOrdered", res);
                if (res.data.ERROR == "0000") {
                    this.setState({
                        Data: res.data,
                        loading: true
                    })
                } else {
                    this.showToast(res);
                }
            })
            .catch((err) => {
            });
        await listStores({
            USERNAME: this.props.username,
            CODE_ORDER: ID,
            IDSHOP: this.props.idshop.USER_CODE,
        })
            .then((res) => {
                console.log("this is listStores", res)
                if (res.data.ERROR == "0000") {
                    this.setState({
                        List: res.data.INFO,
                        loading: true
                    })
                } else {
                    this.showToast(res);
                }
            })
            .catch((err) => {
            });
    }
    // Data 
    // ADDRESS_RECEIVER: "Hà nội việt nam"
    // CREATE_DATE: "23/09/2020 16:10:19"
    // DISTCOUNT: null
    // EMAIL: "viettv@neo.vn"
    // ERROR: "0000"
    // EXTRA_SHIP: null
    // FULLNAME_RECEIVER: "f5sell"
    // FULL_NAME_CTV: "f5sell"
    // ID_CITY: "01"
    // ID_CODE_ORDER: "X43WFOD4"
    // ID_DISTRICT: "001"
    // MESSAGE: "SUCCESS"
    // MOBILE: "123456"
    // MOBILE_RECEIVER: "123456789"
    // NOTE: null
    // PAYED: "0"
    // REASON_SURCHARGE: null
    // RESULT: "Lấy đơn hàng chi tiết thành công"
    // STATUS: "1"
    // STATUS_EDIT: 0
    // STATUS_NAME: "Đã tiếp nhận"
    // SURCHARGE: "0"
    // TIME_RECEIVER: null
    // TOTAL_COMMISSION: "1650"
    // USER_CODE: "YU2L0E"
    // USER_COMMISSION: "0"


    // List
    // CODE_PRODUCT: "FCGVHB"
    // COMISSION_PRODUCT: "0"
    // COMMISSION: 1
    // COMMISSION_PRICE: "1650"
    // COMMISSION_PRODUCT: "0"
    // DISCOUNT: null
    // ID: "4"
    // ID_CODE_ORDER: "X43WFOD4"
    // ID_PRODUCT_PROPERTIES: "0"
    // IMAGE_COVER: "https://bizweb.dktcdn.net/thumb/1024x1024/100/321/400/products/stives-apricot-scrub-acne-control-283g.jpg"
    // MONEY: "165000"
    // NOTE: null
    // NUM: "1"
    // OD_PRODUCT_PROPERTIES: null
    // PRICE: "165000"
    // PRODUCT_COMMISSION: "0"
    // PRODUCT_NAME: "TẨY TẾ BÀO CHẾT NGỪA MỤN HÀNG MƠ  STIVES APRICOT SCRUB ACNE CONTROL 283G USA NEW LOOK"
    // PROPERTIES: null
    // STATUS_EDIT: 0
    handleNumber = (item) => {
        const { status, authUser } = this.props;
        var resutl = {
            AMOUNT: "",
            PRICE: "",
            CODE_PRODUCT: "",
            MONEY: "",
            BONUS: "",
            ID_PRODUCT_PROPERTIES: "",
        };
        for (let i = 0; i < item.length; i++) {
            resutl.AMOUNT = resutl.AMOUNT + item[i].NUM + "#";
            resutl.CODE_PRODUCT = resutl.CODE_PRODUCT + item[i].CODE_PRODUCT + "#";
            resutl.PRICE = resutl.PRICE + item[i].PRICE + "#";
            resutl.MONEY =
                resutl.MONEY +
                handleMoney(status, item[i], authUser) * parseInt(item[i].NUM) +
                "#";
            resutl.BONUS = resutl.BONUS + item[i].PRICE_PROMOTION + "#";
            resutl.ID_PRODUCT_PROPERTIES =
                resutl.ID_PRODUCT_PROPERTIES + item[i].ID_PRODUCT_PROPERTIES + "#";
        }
        resutl.BONUS = resutl.BONUS.substring(0, resutl.BONUS.length - 1);
        resutl.AMOUNT = resutl.AMOUNT.substring(0, resutl.AMOUNT.length - 1);
        resutl.CODE_PRODUCT = resutl.CODE_PRODUCT.substring(
            0,
            resutl.CODE_PRODUCT.length - 1
        );
        resutl.MONEY = resutl.MONEY.substring(0, resutl.MONEY.length - 1);
        resutl.PRICE = resutl.PRICE.substring(0, resutl.PRICE.length - 1);
        resutl.ID_PRODUCT_PROPERTIES = resutl.ID_PRODUCT_PROPERTIES.substring(
            0,
            resutl.ID_PRODUCT_PROPERTIES.length - 1
        );
        return resutl;
    };
    handleBook = () => {
        const {
            city,
            district,
            address,
            List,
            setSelectedValue,
            text
        } = this.state;
        var result = this.handleNumber(List);
        console.log("this is watting", result);
        console.log("thiss iss lisst", List);
        // const List = {
        //     CODE_PRODUCT: "FCGVHB",
        //     COMISSION_PRODUCT: "0",
        //     COMMISSION: null,
        //     COMMISSION_PRICE: null,
        //     COMMISSION_PRODUCT: "0",
        //     DISCOUNT: "0",
        //     ID: "4",
        //     ID_CODE_ORDER: "QLAV78LZ",
        //     ID_PRODUCT_PROPERTIES: "0",
        //     MONEY: "660000",
        //     NOTE: null,
        //     NUM: "4",
        //     OD_PRODUCT_PROPERTIES: null,
        //     PRICE: "165000",
        //     PRODUCT_COMMISSION: "0",
        //     PROPERTIES: null,
        //     STATUS_EDIT: 0,
        // }

        this.setState({
            loading: true,
        },
            async () => {
                var result;
                if (List.length != 0) {
                    result = await this.handleNumber(List);
                }
                updateOrder({
                    USERNAME: this.props.authUser.USERNAME,
                    CODE_PRODUCT: result.CODE_PRODUCT,
                    AMOUNT: result.NUM,
                    PRICE: result.PRICE,
                    MONEY: result.MONEY,
                    BONUS: result.COMMISSION_PRODUCT,
                    FULL_NAME: this.props.username,
                    MOBILE_RECEIVER: "123456",
                    ID_CITY: city.MATP,
                    ID_DISTRICT: district.MAQH,
                    ADDRESS: address,
                    CODE_ORDER: result.ID_CODE_ORDER,
                    STATUS: setSelectedValue,
                    EXTRA_SHIP: "10000",
                    TIME_RECEIVER: '31/05/2019 14:00:00',
                    NOTE: text,
                    DISTCOUNT: '',
                    IDSHOP: this.props.idshop.USER_CODE,
                })
                    .then((result) => {
                        console.log("this is updateOrder", result);
                        if (result.data.ERROR == "0000") {
                            this.setState(
                                {
                                    loading: false,
                                   
                                }
                            );
                            Alert.alert("Thông báo",`${result.data.RESULT}`)
                        } else {
                            Alert.alert("Thông báo",`${result.data.RESULT}`)
                        }
                    })
                    .catch((error) => {
                        console.log("err file ware");
                    });
            })
    };
    componentDidMount() {

        this.handleLoad();
    }
    render() {
        const { selectedValue, Data, loading, List, message, setSelectedValue } = this.state;
        console.log("this is data", List);
        console.log("data full ", Data);
        // console.log("this is List", List);
        const { ID,STATUS } = this.props.route.params;
        console.log("this is status",STATUS);
        var sumMoney = 0;
        var sumRose = 0;

        const handleTotlaMoney = () => {
            if (List.length != 0) {
                for (let i = 0; i < List.length; i++) {
                    sumMoney +=
                        parseFloat(List[i].MONEY);
                }
                return sumMoney;
            } else { }
        }
        const sumAllMoney = () => {
            if (List.length != 0) {
                return sumMoney + parseFloat(Data.EXTRA_SHIP) - List[0].DISCOUNT;
            }

        }
        const discount = () => {
            if (List.length != 0) {
                for (let i = 0; i < List.length; i++) {
                    sumRose +=
                        parseFloat(List[i].PRICE) * List[i].COMISSION_PRODUCT * 0.01 + parseFloat(List[i].PRICE) * List[i].COMMISSION * 0.01;
                }
                return sumRose;
            } else { }
        }
        return (
            <View>
                {!loading ? null : <View style={{ marginBottom: 20 }}>
                    <ScrollView>
                        <View style={{ height: sizeHeight(5), flexDirection: 'column', justifyContent: 'center', paddingLeft: 10 }}>
                            <Text style={{ fontWeight: 'bold' }}>Mã HĐ: {Data.ID_CODE_ORDER}</Text>
                        </View>
                        <View style={{ height: 35, paddingLeft: 10, backgroundColor: '#149CC6', justifyContent: 'center' }}>
                            <Text style={{ color: '#fff' }}>Thông tin CTV</Text>
                        </View>
                        <View style={{ padding: 10 }}>
                            <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                                <Text>{Data.FULL_NAME_CTV}</Text>
                                <Text style={{backgroundColor:'#E1AC06',padding:2,color:'#fff'}}>{this.props.authUser.GROUPS==5?"CTV":"KH"}</Text>
                            </View>
                            <Text>Mã CTV: {Data.USER_CODE}</Text>
                            <Text>Số điện thoại: {Data.MOBILE}</Text>
                            <Text>Email: {Data.EMAIL}</Text>
                        </View>
                        <View style={{ height: 35, backgroundColor: '#149CC6', justifyContent: 'center' }}>
                            <Text style={{ color: '#fff', paddingLeft: 10 }}>Nội dung đơn hàng</Text>
                        </View>
                        <View>

                            <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 7 }}>
                                <Image source={require("../../assets/images/clock.png")}
                                    style={{ width: 20, height: 40 }}
                                />
                                <Text style={{ fontStyle: 'italic' }}>{Data.CREATE_DATE}</Text>
                            </View>
                            {List.length === 0 ? null : List.map((Val, key) => (
                                <View>
                                    <View key={key}>
                                        <View style={{ flexDirection: 'row', borderColor: '#CBD3D3', borderWidth: 1, margin: 5 }}>
                                            <View style={{ width: sizeWidth(30), borderRightColor: '#CBD3D3', borderRightWidth: 1, height: sizeHeight(20), alignItems: 'center', justifyContent: 'center' }}>
                                                <Image
                                                    source={{ uri: Val.IMAGE_COVER }}
                                                    style={{ width: sizeWidth(20), height: sizeHeight(10) }}
                                                />
                                            </View>
                                            <View style={{ width: sizeWidth(70), padding: 5 }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: sizeFont(4) }}>{Val.PRODUCT_NAME}</Text>
                                                <Text>Mã sản phẩm: {Val.CODE_PRODUCT}</Text>
                                                <Text>Đơn giá: <Text style={{ color: 'red' }}>{numeral(Val.PRICE).format("0,0")} đ</Text></Text>
                                                <Text>Số lượng: {Val.NUM}</Text>
                                                <Text>Hoa hồng: <Text style={{ color: "#149CC6" }}>{Val.COMISSION_PRODUCT}%</Text></Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            ))}
                            <View style={{ flexDirection: 'row' }}>
                               
                                <View>
                                    <View style={{ flexDirection: 'row', width: sizeWidth(100), padding: 10, justifyContent:"space-between" }}>
                                        <Text>Thành tiền</Text>
                                        <Text style={{ color: 'red', fontWeight: 'bold' }}>
                                            {numeral(handleTotlaMoney()).format("0,0")} đ
                                    </Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', width: sizeWidth(100), padding: 10, justifyContent:"space-between" }}>
                                        <Text>Tiền giảm giá</Text>
                                        <Text style={{ color: '#149CC6', fontWeight: 'bold' }}>
                                            {List.length != 0 ? numeral(List[0].DISCOUNT).format("0,0") : null} đ
                                    </Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', width: sizeWidth(100), padding: 10, paddingTop: 0, justifyContent:"space-between" }}>
                                        <Text>Phí vận chuyển</Text>
                                        <Text style={{ color: 'red', fontWeight: 'bold' }}>{numeral(Data.EXTRA_SHIP).format("0,0")} đ</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', width: sizeWidth(100), padding: 10, paddingTop: 0, justifyContent:"space-between" }}>
                                        <Text>Tổng tiền thanh toán</Text>
                                        <Text style={{ color: 'red', fontWeight: 'bold' }}>{numeral(sumAllMoney()).format("0,0")} đ</Text>
                                    </View>
                                </View>

                            </View>
                        </View>
                        <View>
                            <View style={styles.status}>
                                <View style={styles.status1}><Text>Người nhận</Text></View>
                                <View style={styles.status2}><Text>{Data.FULLNAME_RECEIVER}</Text></View>
                            </View>
                            <View style={styles.status}>
                                <View style={styles.status1}><Text>Số điện thoại</Text></View>
                                <View style={styles.status2}><Text>{Data.MOBILE_RECEIVER}</Text></View>
                            </View>
                            <View style={styles.status}>
                                <View style={styles.status1}><Text>Nhận hàng tại</Text></View>
                                <View style={styles.status2}><Text>{Data.ADDRESS_RECEIVER}</Text></View>
                            </View>
                        </View>
                        <View style={{ height: 35, backgroundColor: '#149CC6', marginTop: sizeHeight(5), justifyContent: 'center' }}>
                            <Text style={{ color: '#fff', paddingLeft: 5 }}>Tình trạng đơn hàng</Text>
                        </View>


                        {/* trạng thái */}
                        <View style={{ padding: 5 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Text>Trạng thái: </Text>
                                <View
                                    style={{

                                        // The solution: Apply zIndex to any device except Android
                                        ...(Platform.OS !== 'android' && {
                                            zIndex: 10
                                        })

                                    }}
                                >
                                    <DropDownPicker
                                        items={[
                                            { label: 'Đã tiếp nhận', value: '0' },
                                            { label: 'Huỷ', value: '1' }
                                        ]}
                                        defaultValue={setSelectedValue}
                                        placeholder="Trạng thái"
                                        containerStyle={{ height: sizeHeight(5) }}
                                        style={{ backgroundColor: '#fafafa', width: sizeWidth(40), borderColor: '#E1AC06', borderWidth: 1, backgroundColor: '#E1AC06' }}
                                        itemStyle={{
                                            justifyContent: 'flex-start'
                                        }}
                                        dropDownStyle={{ backgroundColor: '#fafafa', width: sizeWidth(40) }}
                                        onChangeItem={item => this.setState({
                                            setSelectedValue: item.value
                                        })}
                                    />
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, zIndex: -1 }}>
                                <Text>Thời gian dự kiến nhận hàng: </Text>
                                <View style={styles.confix15}>
                                    <TouchableOpacity
                                        onPress={this.showDatePicker2}
                                        style={{ flexDirection: 'row', alignItems: 'center' }}
                                    >
                                        <Image
                                            source={require('../../assets/images/lich.png')}
                                            style={{ width: 20, height: 20 }}
                                        />
                                        <Text style={{ fontSize: 12 }}>{this.state.endTime}</Text>
                                    </TouchableOpacity>
                                    <DateTimePickerModal
                                        isVisible={this.state.inDateEndPicker}
                                        mode="date"
                                        onConfirm={this.handleConfirm2}
                                        onCancel={this.hideDatePicker2}
                                    />
                                </View>
                            </View>
                            <View style={{ zIndex: -1 }}>
                                <Text>Ghi chú: </Text>
                                <TextInput
                                    multiline={true}
                                    numberOfLines={4}
                                    onChangeText={(text) => this.setState({ text })}
                                    value={Data.NOTE}
                                    style={{ borderBottomColor: "#4B4C4B", borderWidth: 1, borderRadius: 5,paddingLeft:10 }}
                                />
                            </View>
                            <View style={{ justifyContent: 'center', flexDirection: 'row', marginTop: 10 }}>
                                <TouchableOpacity
                                    onPress={() => { this.handleBook() }}
                                    disabled={STATUS==1?false:true}
                                    style={{
                                        borderWidth: 1, borderColor: '#E1AC06', paddingLeft: 30, paddingRight: 30, paddingTop: 10, paddingBottom: 10
                                        , backgroundColor: '#E1AC06', alignItems: 'center', borderRadius: 10
                                    }}
                                >
                                    <Text style={{color:'#fff'}}>Cập nhật</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </View>}
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        status: state.authUser.status,
        authUser: state.authUser.authUser,
        username: state.authUser.username,
        idshop: state.product.database,
    };
};
const styles = StyleSheet.create({
    confix: {
        fontSize: 15,
        borderColor: '#E1AC06',
        paddingLeft: 10,
        paddingRight: 10,
        borderWidth: 2,
        borderRadius: 15,
    },
    confix1: {
        marginTop: 10,
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'row',
    },
    confix2: {
        borderColor: '#E1AC06',
        borderWidth: 2,
        width: sizeWidth(40),
        height: sizeHeight(7),
        borderRadius: 15,
    },
    status: {
        flexDirection: 'row',
        borderRadius: 50,
    },
    status1: {
        width: sizeWidth(40),
        borderColor: '#CCCECE',
        borderWidth: 1,
    },
    status2: {
        width: sizeWidth(60),
        borderColor: '#CCCECE',
        borderWidth: 1,
    },
    confix15: {
        width: sizeWidth(40),
        borderColor: '#E1AC06',
        padding: 5,
        borderWidth: 1,
        borderRadius: 5,

    }
})

export default connect(
    mapStateToProps,
    null
)(OrderMain);
