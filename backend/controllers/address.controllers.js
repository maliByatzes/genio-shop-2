import Address from "../models/address.model.js";
import User from "../models/user.model.js";
import logger from "../utils/logger.js";

export const addAddress = async (req, res) => {
  try {
    const { unitNumber, street, addressLine1, addressLine2, postalCode, city, country } = req.body;
    const userId = req.user._id;

    if (!street || !addressLine1 || !postalCode || !city || !country) {
      return res.status(400).json({ error: "Please provide all required fields" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const newAddress = new Address({
      unitNumber,
      street,
      addressLine1,
      addressLine2,
      postalCode,
      city,
      country,
    });

    if (user.addresses.length === 0) {
      newAddress.isDefault = true;
    }

    user.addresses.push(newAddress._id);

    await Promise.all([await newAddress.save(), await user.save()]);

    res.status(201).json(newAddress);
  } catch (error) {
    logger.error(`Error in add address: ${error.message}`);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAddresses = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate("addresses");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user.addresses);
  } catch (error) {
    logger.error(`Error in get addresses: ${error.message}`);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const { id: addressId } = req.params;
    const { unitNumber, street, addressLine1, addressLine2, postalCode, city, country, isDefault } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId).populate("addresses");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userAddress = user.addresses.find((address) => address._id.toString() === addressId);
    if (!userAddress) {
      return res.status(404).json({ error: "Address not found in user" });
    }

    if (isDefault) {
      const defaultAddress = user.addresses.find((address) => address.isDefault === true);
      if (defaultAddress && defaultAddress._id.toString() !== addressId) {
        defaultAddress.isDefault = false;
      }
      userAddress.isDefault = true;
    }

    let address = await Address.findById(addressId);
    if (!address) {
      return res.status(404).json({ error: "Address not found" });
    }

    address.unitNumber = unitNumber || address.unitNumber;
    address.street = street || address.street;
    address.addressLine1 = addressLine1 || address.addressLine1;
    address.addressLine2 = addressLine2 || address.addressLine2;
    address.postalCode = postalCode || address.postalCode;
    address.city = city || address.city;
    address.country = country || address.country;
    if (typeof isDefault === "boolean") {
      address.isDefault = isDefault;
    }

    await address.save();
    await user.save();

    res.status(200).json(address);
  } catch (error) {
    logger.error(`Error in update address: ${error.message}`);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const { id: addressId } = req.params;
    const userId = req.user._id;

    const user = await User.findById(userId).populate("addresses");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userAddress = user.addresses.find((address) => address._id.toString() === addressId);
    if (!userAddress) {
      return res.status(404).json({ error: "Address not found in user" });
    }

    const address = await Address.findById(addressId);
    if (!address) {
      return res.status(404).json({ error: "Address not found" });
    }

    user.addresses = user.addresses.filter((address) => address._id.toString() !== addressId);

    await Promise.all([await Address.findByIdAndDelete(addressId), await user.save()]);

    res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) {
    logger.error(`Error in delete address: ${error.message}`);
    res.status(500).json({ error: "Internal server error" });
  }
};
