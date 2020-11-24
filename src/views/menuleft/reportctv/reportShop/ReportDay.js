import React, { Component } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image, Picker, ScrollView, RefreshControl, Alert } from 'react-native'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import { sizeHeight, sizeWidth } from '../../../../utils/helper/size.helper';
import { connect } from 'react-redux';
var numeral = require("numeral");
import { ReportDefault } from "../../../../service/account";
import DropDownPicker from 'react-native-dropdown-picker';

class ReportDay extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            selectMonth: '10',
            selectYear: '2020',
        }
    }
    handLoad = () => {
        ReportDefault({
            USERNAME: this.props.username,
            YEAR: this.state.selectYear,
            MONTH: this.state.selectMonth,
            REPORT_TYPE: '3',
            IDSHOP: this.props.idshop.USER_CODE,
        })
            .then((result) => {
                if (result.data.ERROR == '0000') {
                    this.setState({
                        data: result.data.INFO
                    })
                } else {
                    Alert.alert('Thông báo', 'Không có dữ liệu')

                }
            })
    }
    componentDidMount() {
        this.handLoad();
    }
    render() {
        const { selectYear, selectMonth, data } = this.state;
        return (
            <View >
                <View>
                    <View style={styles.container}>
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
                                    { label: '2020', value: '2020' },
                                    { label: '2019', value: '2019' }
                                ]}
                                defaultValue={selectYear}
                                placeholder="Chọn năm"
                                containerStyle={{ height: 40 }}
                                style={{ backgroundColor: '#fafafa', width: sizeWidth(40), borderColor: '#E1AC06', borderWidth: 2 }}
                                itemStyle={{
                                    justifyContent: 'flex-start'
                                }}
                                dropDownStyle={{ backgroundColor: '#fafafa', width: sizeWidth(40) }}
                                onChangeItem={item => this.setState({
                                    selectYear: item.value
                                }, () => { this.handLoad() })}
                            />
                        </View>
                        <View
                            style={{
                                ...(Platform.OS !== 'android' && {
                                    zIndex: 10
                                })

                            }}
                        >
                            <DropDownPicker
                            
                                items={[
                                    { label:'1', value:'1' },
                                    { label:'2', value:'2' },
                                    { label:'3', value:'3' },
                                    { label:'4', value:'4' },
                                    { label:'5', value:'5' },
                                    { label:'6', value:'6' },
                                    { label:'7', value:'7' },
                                    { label:'8', value:'8' },
                                    { label:'9', value:'9' },
                                    { label:'10', value:'10' },
                                    { label:'11', value:'11' },
                                    { label:'12', value:'12' },
                                ]}
                                defaultValue={selectMonth}
                                placeholder="Chọn tháng"
                                containerStyle={{ height: 40 }}
                                style={{ backgroundColor: '#fafafa', width: sizeWidth(40), borderColor: '#E1AC06', borderWidth: 2 }}
                                itemStyle={{
                                    justifyContent: 'flex-start'
                                }}
                                dropDownStyle={{ backgroundColor: '#fafafa', width: sizeWidth(40) }}
                                onChangeItem={item => this.setState({
                                    selectMonth: item.value
                                }, () => { this.handLoad() })}
                            />
                        </View>
                    </View>
                </View>
                <ScrollView horizontal={true} style={{zIndex:-1}}>
                    <View style={{ flexDirection: 'column' }}>
                        <View style={[styles.mainUser, styles.custom, styles.customTop]}>
                            <Text style={styles.row1}>Ngày</Text>
                            <Text style={styles.row2}>Số lượng ĐH</Text>
                            <Text style={styles.row4}>Tổng doanh số</Text>
                            <Text style={styles.row5}>Hoa hồng</Text>
                            <Text style={styles.row6}>Thực thu</Text>
                        </View>
                        <View>
                            {data.map((val, key) => {
                                return (
                                    <View style={[styles.mainUser, styles.custom]}>
                                        <Text style={styles.row1}>{val.DAY}</Text>
                                        <Text style={styles.row2}>{val.TOTAL_ORDER}</Text>
                                        <Text style={styles.row4}>{numeral(val.TOTAL_TT).format("0,0")}</Text>
                                        <Text style={styles.row5} >{numeral(val.TOTAL_COMMISSION).format("0,0")}</Text>
                                        <Text style={styles.row6}>{numeral(val.TOTAL_MONEY).format("0,0")}</Text>
                                    </View>
                                )
                            })}
                        </View>
                    </View>
                </ScrollView>
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
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
    },
    mainUser: {
        flexDirection: 'row',
    },
    row1: {
        paddingTop: sizeHeight(1),
        height: sizeHeight(5),
        textAlign: 'center',
        width: sizeWidth(12),
        borderRightColor: '#E1AC06',
        borderRightWidth: 1,
    },
    row2: {
        paddingTop: sizeHeight(1),
        textAlign: 'center',
        width: sizeWidth(30),
        borderRightColor: '#E1AC06',
        borderRightWidth: 1,
    },
    row3: {
        paddingTop: sizeHeight(1),
        textAlign: 'center',
        width: sizeWidth(30),
        borderRightColor: '#E1AC06',
        borderRightWidth: 1,
    },
    row4: {
        paddingTop: sizeHeight(1),
        textAlign: 'center',
        width: sizeWidth(30),
        borderRightColor: '#E1AC06',
        borderRightWidth: 1,
    },
    row5: {
        paddingTop: sizeHeight(1),
        textAlign: 'center',
        width: sizeWidth(30),
        borderRightColor: '#E1AC06',
        borderRightWidth: 1,
    },
    row6: {
        paddingTop: sizeHeight(1),
        textAlign: 'center',
        width: sizeWidth(30),
        borderRightColor: '#E1AC06',
        borderRightWidth: 1,
    },
    row7: {
        paddingTop: sizeHeight(1),
        textAlign: 'center',
        width: sizeWidth(20),
        borderRightColor: '#E1AC06',
        borderRightWidth: 1,
    },
    custom: {
        borderBottomColor: '#E1AC06',
        borderBottomWidth: 1,

    },
    customTop: {
        borderTopColor: '#E1AC06',
        borderTopWidth: 1,
    }
})

export default connect(
    mapStateToProps,
    null
)(ReportDay);
