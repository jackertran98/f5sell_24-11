import React, { Component } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
  Keyboard
} from "react-native";
import { connect } from "react-redux";
import { Provider } from "react-native-paper";
import { Avatar, CheckBox } from "react-native-elements";
import {
  sizeHeight,
  sizeFont,
  sizeWidth,
} from "../../../utils/helper/size.helper";
import {
  checkFullName,
  isVietnamesePhoneNumber,
  alphanumeric,
} from "../../../utils/check";
import { COLOR } from "../../../utils/color/colors";
import styles from "./style";
import { FormTextInput } from "../../../components/textinput";
import { orderProduct } from "../../../service/order";
import { AlertCommon } from "../../../components/error";
import Loading from "../../../components/loading";
import { handleMoney } from "../../../components/money";
import { removeToCart, removeAllToCart } from "../../../action/orderAction";

var numeral = require("numeral");
class DetailAddressCart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phoneText: this.props.authUser.MOBILE,
      userName: this.props.authUser.FULL_NAME,
      idStore: "",
      levelStore: "",
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
      address: this.props.authUser.ADDRESS,
      passport: "",
      account: "",
      nameAccount: "",
      nameBank: "",
      showAlert: false,
      checked: true,
      note: "",
      SUM: this.props.route.params.SUM,
      message: "",
      loading: false,
      value: false,
      shipcode: false,
    };
    this.message = "";
  }
  changeCity = (text) => {
    if (text == "- tất cả -") {
      this.setState({ city: "", district: "", districChild: "" });
    } else {
      this.setState({ city: text, district: "", districChild: "" }, () => {
        console.log(this.state.district, "2020202020202020");
      });
    }
  };
  changeDistrict = (text) => {
    if (text == "- tất cả -") {
      this.setState({ district: "", districChild: "" });
    } else this.setState({ district: text, districChild: "" });
  };
  changeDistrictChild = (text) => {
    if (text == "- tất cả -") {
      this.setState({ districChild: "" });
    } else this.setState({ districChild: text });
  };
  handleImage = () => {
    ImagePicker.showImagePicker(options, async (response) => {

      if (response.didCancel) {
      } else if (response.error) {
      } else if (response.customButton) {
      } else {
        const source = { uri: response.uri };

        this.setState({
          loading: true,
        });
      }
    });
  };
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
      resutl.AMOUNT = resutl.AMOUNT + item[i].COUNT + "#";
      resutl.CODE_PRODUCT = resutl.CODE_PRODUCT + item[i].CODE_PRODUCT + "#";
      resutl.PRICE = resutl.PRICE + item[i].PRICE + "#";
      resutl.MONEY =
        resutl.MONEY +
        handleMoney(status, item[i], authUser) * parseInt(item[i].COUNT) +
        "#";
      resutl.BONUS = resutl.BONUS + item[i].PRICE * item[i].COMISSION_PRODUCT * 0.01 + "#";
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
      phoneText,
      userName,
      city,
      district,
      address,
    } = this.state;
    const { listItem, authUser, navigation } = this.props;
    const { item } = this.props.route.params;
    Keyboard.dismiss();
    if (
      userName.trim() == "" ||
      checkFullName(userName) ||
      userName.length > 50
    ) {
      AlertCommon(
        "Thông báo",
        "Họ và tên không chứa ký tự đặc biệt và không quá 50 ký tự",
        () => null
      );
    } else if (address.length > 100) {
      AlertCommon(
        "Thông báo",
        "Không cho nhập quá 100 ký tự",
        () => null
      );
    }
    else if (!isVietnamesePhoneNumber(phoneText)) {
      AlertCommon(
        "Thông báo",
        "Số điện thoại không hợp lệ",
        () => null
      );
    }
    else if (address.length > 100) {
      AlertCommon(
        "Thông báo",
        "Bạn đã nhập quá 100 ký tự cho phép",
        () => null
      );
    }

    else {
      this.setState(
        {
          loading: true,
          message: "",
        },
        async () => {
          var result;
          if (item == undefined) {
            result = await this.handleNumber(listItem);
          } else {
            result = await this.handleNumber(item);
          }
          orderProduct({
            USERNAME: authUser.USERNAME,
            CODE_PRODUCT: result.CODE_PRODUCT,
            AMOUNT: result.AMOUNT,
            PRICE: result.PRICE,
            MONEY: result.MONEY,
            BONUS: result.BONUS,
            FULL_NAME: userName,
            MOBILE_RECEIVER: phoneText,
            ID_CITY: city.MATP,
            ID_DISTRICT: district.MAQH,
            ADDRESS: address,
            IDSHOP: this.props.idshop.USER_CODE,
          })
            .then((result) => {
              console.log("this is orderProduct", result);
              if (result.data.ERROR == "0000") {
                this.setState(
                  {
                    loading: false,
                    message: result.data.RESULT,
                  },
                  () => {
                    this.props.removeAllToCart();
                    return AlertCommon("Thông báo", "Đặt hàng thành công", () => {
                      navigation.navigate("Order"),
                        navigation.popToTop();
                    });
                  }
                );
              } else {
                this.setState(
                  {
                    loading: false,
                    message: result.data.RESULT,
                  },
                  () => {
                    return AlertCommon("Thông báo", "Đặt hàng thất bại", () =>
                      this.props.navigation.navigate("home")
                    );
                  }
                );
              }
            })
            .catch((error) => {
            });
        }
      );
    }

  };
  checkError = () => {
    const {
      phoneText,
      userName,
      city,
      district,
      districChild,
      address,
      note,
      showAlert,
      SUM,
    } = this.state;
    if (
      phoneText == "" ||
      userName == "" ||
      city == "" ||
      district == "" ||
      address == ""
    ) {
      return false;
    }
    return true;
  };
  handleTotlaMoney = (item) => {
    console.log("ádfsdf", item)
    var sumMoney = 0;
    // if (this.state.checked) {
    //   for (let i = 0; i < item.length; i++) {
    //     sumMoney +=
    //       parseFloat(item[i].COST_SHIP) + parseFloat(item[i].COST_SETUP);
    //   }
    // } else {
    //   for (let i = 0; i < item.length; i++) {
    //     sumMoney += parseFloat(item[i].COST_SHIP);
    //   }
    // }
    return numeral(this.state.SUM).format(
      "0,0"
    );
  };
  roseMoney = (item) => {
    var sumMoney = 0;
    for (let i = 0; i < item.length; i++) {
      sumMoney +=
        parseFloat(item[i].HHMAX);
    }

    return numeral(sumMoney).format(
      "0,0"
    );
  }
  render() {
    const {
      phoneText,
      userName,
      city,
      district,
      address,
      SUM,
      districChild,
      value,
      shipcode,
    } = this.state;
    const { listItem } = this.props;
    console.log("this is log", this.props.authUser)
    console.log("this is list_item", listItem);
    const { item } = this.props.route.params;
    return (
      <Provider>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            backgroundColor: "#fff",
            paddingBottom: sizeHeight(10),
          }}
        >
          <View style={styles.infor}>
            <Text style={styles.textInfor}>Thông tin khách hàng</Text>
          </View>
          <View style={{ alignSelf: "center" }}>
            <FormTextInput
              props={{
                placeholder: "Họ và tên",
                placeholderTextColor: "#Fafafa",
                type: "name",
                size: sizeFont(6),
                name: "times-circle",
                value: userName,
                onChangeText: (text) => this.setState({ userName: text }),
                primary: "#017DFF",
                color: COLOR.COLOR_ICON,
                onDelete: () => this.setState({ userName: "" }),
                style: styles.styleWidth,
              }}
              eye={false}
              onSetSee={this.onSetSee}
              styleTextInput={{
                width: sizeWidth(78),
              }}
              styleChild={styles.styleChild}
            />

            <FormTextInput
              props={{
                placeholder: "Điện thoại",
                placeholderTextColor: "#999",
                type: "phone",
                size: sizeFont(6),
                name: "times-circle",
                value: phoneText,
                onChangeText: (text) => this.setState({ phoneText: text }),
                primary: "#017DFF",
                color: COLOR.COLOR_ICON,
                onDelete: () => this.setState({ phoneText: "" }),
                style: styles.styleWidth,
              }}
              eye={false}
              onSetSee={this.onSetSee}
              styleTextInput={{
                width: sizeWidth(78),
              }}
              styleChild={styles.styleChild}
            />

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', margin: 10 }}>
              <TouchableOpacity
                style={{ flexDirection: 'row' }}
                onPress={() => { this.setState({ value: true }) }}
              >
                <View style={{ borderRadius: 50, width: 20, height: 20, borderColor: '#E1AC06', borderWidth: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ backgroundColor: `${value ? '#E1AC06' : 'white'}`, borderRadius: 50, width: 12, height: 12 }}></Text>
                </View>
                <Text style={{ marginLeft: 10 }}>Lấy hàng tại kho</Text>
              </TouchableOpacity>

              <TouchableOpacity style={{ flexDirection: 'row' }}
                onPress={() => { this.setState({ value: false }) }}
              >
                <View style={{ borderRadius: 50, width: 20, height: 20, borderColor: '#E1AC06', borderWidth: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ backgroundColor: `${value ? 'white' : '#E1AC06'}`, borderRadius: 50, width: 12, height: 12 }}></Text>
                </View>
                <Text style={{ marginLeft: 10 }}>Giao hàng nhanh</Text>
              </TouchableOpacity>
            </View>

            <View>
              {value ? null : <View style={{ alignSelf: "center", marginTop: sizeHeight(1) }}>
                <FormTextInput
                  props={{
                    placeholder: "Tỉnh/Thành phố",
                    placeholderTextColor: "#999",
                    type: "email",
                    size: sizeFont(8),
                    name: "chevron-down",
                    value: city.NAME == undefined ? "" : city.NAME,
                    onChangeText: (text) => null,
                    primary: "#017DFF",
                    color: COLOR.BUTTON,
                    onDelete: () => null,
                    style: styles.styleWidth,
                  }}
                  eye={false}
                  onSetSee={this.onSetSee}
                  styleTextInput={{
                    width: sizeWidth(76),
                  }}
                  styleChild={styles.styleChild}
                  pointerEvents="none"
                  onPressCustom={() => {
                    this.props.navigation.navigate("ListCountries", {
                      onSetCity: this.changeCity,
                      NAME: "DetailAddressCart",
                    });
                  }}
                  changeColor={COLOR.BUTTON}
                  light
                />
                <FormTextInput
                  props={{
                    placeholder: "Quận/Huyện",
                    placeholderTextColor: "#999",
                    type: "email",
                    size: sizeFont(6),
                    name: "chevron-down",
                    value: district.NAME == undefined ? "" : district.NAME,
                    onChangeText: (text) => null,
                    primary: "#017DFF",
                    color: COLOR.BUTTON,
                    onDelete: () => null,
                    style: styles.styleWidth,
                  }}
                  eye={false}
                  onSetSee={this.onSetSee}
                  styleTextInput={{
                    width: sizeWidth(76),
                  }}
                  styleChild={styles.styleChild}
                  pointerEvents="none"
                  onPressCustom={() => {
                    if (city == "") {
                      this.message = "Vui lòng chọn Tỉnh/Thành phố";
                      this.setState({ showAlert: true });
                    } else {
                      this.props.navigation.navigate("ListDistrict", {
                        onSetDistrict: this.changeDistrict,
                        GHN_TINHID: city.MATP,
                        NAME: "DetailAddressCart",
                      });
                    }
                  }}
                  changeColor={COLOR.BUTTON}
                  light
                />
                <FormTextInput
                  props={{
                    placeholder: "Phường/Xã *",
                    placeholderTextColor: "#999",
                    type: "email",
                    size: sizeFont(6),
                    name: "chevron-down",
                    value:
                      districChild.NAME == undefined ? "" : districChild.NAME,
                    onChangeText: (text) => null,
                    primary: "#017DFF",
                    color: COLOR.BUTTON,
                    onDelete: () => null,
                    style: styles.styleWidth,
                  }}
                  eye={false}
                  onSetSee={this.onSetSee}
                  styleTextInput={{
                    width: sizeWidth(76),
                  }}
                  styleChild={styles.styleChild}
                  pointerEvents="none"
                  onPressCustom={() => {
                    if (city == "") {
                      this.setState({ showAlert: true });
                    } else if (district == "") {
                      this.message = "Vui lòng chọn Quận/Huyện";
                      this.setState({ showAlert: true });
                    } else {
                      console.log("dis", district);
                      this.props.navigation.navigate("ListDistrictChild", {
                        onSetDistrictChild: this.changeDistrictChild,
                        GHN_TINHID: district.MAQH,
                        NAME: "DetailAddressCart",
                      });
                    }
                  }}
                  changeColor={COLOR.BUTTON}
                  light
                />
                <FormTextInput
                  props={{
                    placeholder: "Địa chỉ",
                    placeholderTextColor: "#999",
                    type: "email",
                    size: sizeFont(6),
                    name: "times-circle",
                    value: address,
                    onChangeText: (text) => this.setState({ address: text }),
                    primary: "#017DFF",
                    color: COLOR.BUTTON,
                    onDelete: () => this.setState({ address: "" }),
                    style: styles.styleWidth,
                  }}
                  eye={false}
                  onSetSee={this.onSetSee}
                  styleTextInput={{
                    width: sizeWidth(78),
                  }}
                  styleChild={styles.styleChild}
                />
              </View>}
            </View>
          </View>
          <View style={{ marginTop: 25 }}>
            <View style={styles.infor}>
              <Text style={styles.textInfor}>Giá trị hàng hóa</Text>
            </View>
          </View>
          <View
            style={{
              marginTop: sizeHeight(2),
            }}
          >
            <View style={styles.viewMoney}>
              <Text style={styles.textTitle}>Đơn hàng:</Text>
              <Text
                style={[
                  styles.textMoney,
                  {
                    fontWeight: "bold",
                    color: COLOR.BUTTON,
                  },
                ]}
              >
                {this.handleTotlaMoney(listItem)} đ
              </Text>
            </View>
            <View style={styles.viewMoney}>
              <Text style={styles.textTitle}>Phí vận chuyển:</Text>
              <Text
                style={[
                  styles.textMoney,
                  {
                    fontWeight: "bold",
                    color: COLOR.BUTTON,
                  },
                ]}
              >
                {/* {this.roseMoney(listItem)} đ */}
                0 đ
              </Text>
            </View>
            <View style={styles.viewMoney}>
              <Text style={styles.textTitle}>Tổng tiền:</Text>
              <Text
                style={[
                  styles.textMoney,
                  {
                    fontWeight: "bold",
                    color: COLOR.BUTTON,
                  },
                ]}
              >
                {this.handleTotlaMoney(listItem)} đ
              </Text>
            </View>
            <View style={styles.viewMoney}>
              <Text style={styles.textTitle}>Hoa hồng:</Text>
              <Text
                style={[
                  styles.textMoney,
                  {
                    fontWeight: "bold",
                    color: '#149CC6',
                  },
                ]}
              >
                {this.roseMoney(listItem)} đ
              </Text>
            </View>
            <View style={{ marginTop: 25 }}>
              <View style={styles.infor}>
                <Text style={styles.textInfor}>Thanh toán</Text>
              </View>
              <View style={{ marginTop: 10 }}>
                <View style={{ alignItems: 'center' }}>
                  <TextInput
                    style={{ borderColor: '#DDD', borderWidth: 1, width: sizeWidth(90) }}
                    placeholder="Số tiền muốn giảm giá"
                  />
                  <Text style={{ width: sizeWidth(90), fontStyle: 'italic', }}>CTV có thể nhập giảm giá với số tiền không quá số hoa hồng tổng ({this.roseMoney(listItem)}đ) của chính đơn hàng</Text>
                </View>
                <View style={{marginLeft:sizeWidth(5)}}>
                  <Text style={{marginTop:5}}><Text style={{fontWeight:'bold'}}>Tổng tiền</Text> { }</Text>
                  <Text style={{marginTop:5}}><Text style={{fontWeight:'bold'}}>Hoa hồng sau khi giảm trừ</Text> { }</Text>
                  <Text style={{fontStyle: 'italic'}}>(Hoa hồng được cộng sau khi hoàn thành đơn hàng)</Text>
                </View>
              </View>
            </View>
            <View
              style={{
                marginTop: sizeHeight(2),
                borderTopWidth: 4,
                borderTopColor: "#DDD",

              }}
            >
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Text>Hình thức thanh toán</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', margin: 10 }}>
                <TouchableOpacity
                  style={{ flexDirection: 'row' }}
                  onPress={() => { this.setState({ shipcode: true }) }}
                >
                  <View style={{ borderRadius: 50, width: 20, height: 20, borderColor: '#E1AC06', borderWidth: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ backgroundColor: `${shipcode ? '#E1AC06' : 'white'}`, borderRadius: 50, width: 12, height: 12 }}></Text>
                  </View>
                  <Text style={{ marginLeft: 10 }}>COD</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{ flexDirection: 'row' }}
                  onPress={() => { this.setState({ shipcode: false }) }}
                >
                  <View style={{ borderRadius: 50, width: 20, height: 20, borderColor: '#E1AC06', borderWidth: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ backgroundColor: `${shipcode ? 'white' : '#E1AC06'}`, borderRadius: 50, width: 12, height: 12 }}></Text>
                  </View>
                  <Text style={{ marginLeft: 10 }}>Chuyển khoản</Text>
                </TouchableOpacity>
              </View>
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <TextInput
                  style={{ borderColor: '#DDD', borderWidth: 1, width: sizeWidth(90) }}
                  placeholder="Ghi chú cho shop"
                />
              </View>
            </View>
            <View style={{ alignSelf: "center", marginTop: sizeHeight(1) }}>
              <TouchableOpacity
                disabled={this.checkError() == false ? true : false}
                style={[
                  styles.touchOrder,
                  {
                    backgroundColor:
                      this.checkError() == false ? "#999" : COLOR.BUTTON,
                  },
                ]}
                onPress={this.handleBook}
              >
                <Text style={{ color: "#FFF", textAlign: "center" }}>
                  ĐẶT HÀNG
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {this.state.loading ? (
            <View style={{ alignSelf: "center" }}>
              <Loading />
            </View>
          ) : null}
        </ScrollView>
      </Provider>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    status: state.authUser.status,
    authUser: state.authUser.authUser,
    username: state.authUser.username,
    listItem: state.order.listItem,
    idshop: state.product.database,
  };
};

const mapDispatchToProps = (dispatch) => {
  return { removeAllToCart: (text) => dispatch(removeAllToCart()) };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DetailAddressCart);
