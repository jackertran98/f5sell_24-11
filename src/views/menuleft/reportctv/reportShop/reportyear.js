import React, { Component } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image, Picker, ScrollView,RefreshControl } from 'react-native'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import { sizeHeight, sizeWidth } from '../../../../utils/helper/size.helper';
import { connect } from 'react-redux';
var numeral = require("numeral");
import Loading from '../../../../components/loading';
import { ReportDefault } from "../../../../service/account";
class ReportYear extends Component {
    constructor(props){
        super(props)
        this.state={
            data:[],
            loading:'false',
        }
    }
    handLoad = () => {
        ReportDefault({
            USERNAME:'f5shop',
            YEAR: '',
            MONTH: '',
            REPORT_TYPE:'1',
            IDSHOP: this.props.idshop.USER_CODE
        })
        .then((res) => {
            console.log("yearrr",res);
            this.setState({
                data:res.data.INFO
            })
        })    
    }
    componentDidMount() {
        this.handLoad();
    }
    render() {
        const {data}=this.state;
        return (
            <View>
                    <ScrollView horizontal={true}>
                        <View style={{ flexDirection: 'column' }}>
                            <View style={[styles.mainUser, styles.custom, styles.customTop]}>
                                <Text style={styles.row1}>STT</Text>
                                <Text style={styles.row2}>Năm</Text>
                                <Text style={styles.row3}>Số lượng ĐH</Text>
                                <Text style={styles.row4}>Tổng doanh số</Text>
                                <Text style={styles.row5}>Hoa hồng</Text>
                                <Text style={styles.row6}>Thực thu</Text>
                            </View>
                            <View>
                                {data.map((val, key) => {
                                    return (
                                        <View style={[styles.mainUser, styles.custom]}>
                                            <Text style={styles.row1}>{key}</Text>
                                            <Text style={styles.row4}>{val.YEAR}</Text>
                                            <Text style={styles.row2}>{val.TOTAL_ORDER}</Text>
                                            <Text style={styles.row3}>{numeral(val.TOTAL_MONEY).format("0,0")}</Text>
                                            <Text style={styles.row4}>{numeral(val.TOTAL_COMMISSION).format("0,0")}</Text>
                                            <Text style={styles.row5} >{numeral(val.TOTAL_TT).format("0,0")}</Text>
                                            
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
    mainUser:{
        flexDirection:'row',
        
    },
    row1:{
        paddingTop:sizeHeight(1),
        height:sizeHeight(5),
        textAlign:'center',
        width:sizeWidth(10),
        borderRightColor:'#E1AC06',
        borderRightWidth:1,
    },
    row2:{
        paddingTop:sizeHeight(1),
        textAlign:'center',
        width:sizeWidth(30),
        borderRightColor:'#E1AC06',
        borderRightWidth:1,
    },
    row3:{
        paddingTop:sizeHeight(1),
        textAlign:'center',
        width:sizeWidth(30),
        borderRightColor:'#E1AC06',
        borderRightWidth:1,
    },
    row4:{
        paddingTop:sizeHeight(1),
        textAlign:'center',
        width:sizeWidth(30),
        borderRightColor:'#E1AC06',
        borderRightWidth:1,
    },
    row5:{
        paddingTop:sizeHeight(1),
        textAlign:'center',
        width:sizeWidth(30),
        borderRightColor:'#E1AC06',
        borderRightWidth:1,
    },
    row6:{
        paddingTop:sizeHeight(1),
        textAlign:'center',
        width:sizeWidth(30),
        borderRightColor:'#E1AC06',
        borderRightWidth:1,
    },
    row7:{
        paddingTop:sizeHeight(1),
        textAlign:'center',
        width:sizeWidth(20),
        borderRightColor:'#E1AC06',
        borderRightWidth:1,
    },
    custom:{
        borderBottomColor:'#E1AC06',
        borderBottomWidth:1,
        
    },
    customTop:{
        borderTopColor:'#E1AC06',
        borderTopWidth:2,
    }
})

export default connect(
    mapStateToProps,
    null
)(ReportYear);
