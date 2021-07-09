use itertools::Itertools;

#[repr(packed)]
pub struct UserInfoHeader {
    pub page_id: u16,
}

pub const NUM_PAGES:usize = 5000;

#[repr(packed)]
pub struct UserPagesStats {
    pub num_free_slots: [u16; NUM_PAGES],
}
pub fn cast<T>(data: &[u8] ) -> &T {
    assert!(data.len() >= std::mem::size_of::<T>());
    return unsafe{std::mem::transmute(data.as_ptr())};
}

pub const INVALID_PAGE_ID:u16 = u16::MAX;

pub fn is_user_active(data:&[u8]) -> bool {
    let user_info_header = cast::<UserInfoHeader>(data);
    return user_info_header.page_id != INVALID_PAGE_ID;
}

pub fn get_best_page_id(data:&[u8]) -> u16 {
    let user_pages_stats = cast::<UserPagesStats>(data);
    let max_page_id = unsafe{user_pages_stats.num_free_slots.iter().position_max().unwrap()};
    assert!(max_page_id < NUM_PAGES);
    return max_page_id as u16;
}